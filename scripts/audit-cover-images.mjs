#!/usr/bin/env node
/**
 * Audits all posts for external images and localises them.
 *
 * Step 1 — Seed cover: for any migrated post without a coverImage, look up the
 *   matching hashnode backup file (by slug) and inject its `cover:` URL.
 *
 * Step 2 — Localise coverImage: for every post that has a coverImage field:
 *   - External URL  → download to public/assets/<slug>-cover.<ext>, update frontmatter.
 *   - Local /assets/<bad-name> → rename to <slug>-cover.<ext>, update frontmatter.
 *   - Local /assets/<slug>-cover.<ext> → already correct, no action.
 *
 * Step 3 — Localise inline images: scan the post body for markdown image syntax
 *   ![alt](url) where url is on an allowlisted CDN domain. Downloads each to
 *   public/assets/<slug>-<n>.<ext> and rewrites the URL in the markdown.
 *   Dynamic/badge URLs (shields.io, dockeri.co, etc.) are intentionally skipped.
 *
 * Run from repo root:
 *   node scripts/audit-cover-images.mjs [--dry-run]
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const DRY_RUN = process.argv.includes("--dry-run");
const POSTS_DIR = new URL("../posts/", import.meta.url).pathname;
const ASSETS_DIR = new URL("../public/assets/", import.meta.url).pathname;
const HASHNODE_DIR = "/Users/harshit/Personal/hashnode-backup";

// Only localise images from these domains. Everything else (badges, dynamic
// images, shields.io, etc.) stays as an external URL.
const LOCALISE_DOMAINS = [
  "cdn.hashnode.com",
  "res.cloudinary.com",
];

if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

// ── Helpers ──────────────────────────────────────────────────────────────────

function extFromUrl(urlStr) {
  try {
    const ext = path.extname(new URL(urlStr).pathname);
    return ext || ".png";
  } catch {
    return path.extname(urlStr) || ".png";
  }
}

function isExternal(val) {
  return val.startsWith("http://") || val.startsWith("https://");
}

function isWrongLocalName(val) {
  const stem = path.basename(val, path.extname(val));
  return !stem.endsWith("-cover");
}

function shouldLocalise(urlStr) {
  try {
    const host = new URL(urlStr).hostname;
    return LOCALISE_DOMAINS.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

function setCoverInFrontmatter(content, newValue) {
  if (/^coverImage:/m.test(content)) {
    return content.replace(/^coverImage:\s*.+$/m, `coverImage: ${newValue}`);
  }
  return content.replace(/^(---\n[\s\S]*?)(^---)/m, (_, front, close) => {
    return `${front}coverImage: ${newValue}\n${close}`;
  });
}

// Split content into frontmatter and body at the closing --- boundary.
function splitFrontmatter(content) {
  const match = content.match(/^---\n[\s\S]*?\n---\n/);
  if (!match) return { front: "", body: content };
  return { front: match[0], body: content.slice(match[0].length) };
}

// ── Step 1: Build hashnode cover map { slug → coverUrl } ─────────────────────

const hashnodeCoverMap = {};
for (const file of fs.readdirSync(HASHNODE_DIR).filter(f => f.endsWith(".md"))) {
  const content = fs.readFileSync(path.join(HASHNODE_DIR, file), "utf8");
  const slugMatch = content.match(/^slug:\s*(.+)$/m);
  const coverMatch = content.match(/^cover:\s*(.+)$/m);
  if (slugMatch && coverMatch) {
    hashnodeCoverMap[slugMatch[1].trim()] = coverMatch[1].trim();
  }
}

const SLUG_ALIASES = {
  "making-apt-decisions-while-you-code-to-save-money":
    "making-apt-decisions-while-you-code-to-save-money-4bcf1c89dc9c",
};

console.log(`Hashnode cover map: ${Object.keys(hashnodeCoverMap).length} entries`);
console.log(`Dry run: ${DRY_RUN}\n`);

// ── Process each post ─────────────────────────────────────────────────────────

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md")).sort();

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  let content = fs.readFileSync(filePath, "utf8");

  const slugMatch = content.match(/^slug:\s*(.+)$/m);
  const slug = slugMatch ? slugMatch[1].trim() : path.basename(file, ".md");

  console.log(`\n── ${file}`);

  // ── Step 1: Seed coverImage from hashnode if missing ────────────────────
  const coverMatch = content.match(/^coverImage:\s*(.+)$/m);
  let coverValue = coverMatch ? coverMatch[1].trim() : null;

  if (!coverValue) {
    const lookupSlug = SLUG_ALIASES[slug] || slug;
    const hashnodeCover = hashnodeCoverMap[lookupSlug];
    if (hashnodeCover) {
      console.log(`   [SEED  ] coverImage → ${hashnodeCover}`);
      if (!DRY_RUN) {
        content = setCoverInFrontmatter(content, hashnodeCover);
        fs.writeFileSync(filePath, content);
      }
      coverValue = hashnodeCover;
    }
  }

  // ── Step 2: Localise coverImage ─────────────────────────────────────────
  if (coverValue) {
    if (isExternal(coverValue)) {
      const ext = extFromUrl(coverValue);
      const newFilename = `${slug}-cover${ext}`;
      const newLocalPath = `/assets/${newFilename}`;
      const destPath = path.join(ASSETS_DIR, newFilename);

      if (fs.existsSync(destPath)) {
        console.log(`   [ EXIST] coverImage — ${newFilename} already present`);
        if (coverValue !== newLocalPath) {
          if (!DRY_RUN) {
            content = setCoverInFrontmatter(content, newLocalPath);
            fs.writeFileSync(filePath, content);
          }
          console.log(`            frontmatter updated → ${newLocalPath}${DRY_RUN ? " (dry)" : ""}`);
        }
      } else {
        console.log(`   [FETCH ] coverImage ${coverValue}`);
        console.log(`            → ${newLocalPath}`);
        if (!DRY_RUN) {
          try {
            await download(coverValue, destPath);
            content = setCoverInFrontmatter(content, newLocalPath);
            fs.writeFileSync(filePath, content);
            console.log(`            ✓ downloaded & frontmatter updated`);
          } catch (err) {
            console.error(`            ✗ failed: ${err.message}`);
          }
        }
      }
    } else if (coverValue.startsWith("/assets/") && isWrongLocalName(coverValue)) {
      const ext = path.extname(coverValue);
      const newFilename = `${slug}-cover${ext}`;
      const newLocalPath = `/assets/${newFilename}`;
      const oldFilePath = path.join(ASSETS_DIR, path.basename(coverValue));
      const newFilePath = path.join(ASSETS_DIR, newFilename);

      if (!fs.existsSync(oldFilePath)) {
        console.log(`   [WARN  ] coverImage — local file missing: ${coverValue}`);
      } else {
        console.log(`   [RENAME] coverImage ${coverValue} → ${newLocalPath}`);
        if (!DRY_RUN) {
          fs.renameSync(oldFilePath, newFilePath);
          content = setCoverInFrontmatter(content, newLocalPath);
          fs.writeFileSync(filePath, content);
          console.log(`            ✓ renamed & frontmatter updated`);
        }
      }
    } else {
      console.log(`   [  OK  ] coverImage ${coverValue}`);
    }
  }

  // ── Step 3: Localise inline images in body ──────────────────────────────
  const { front, body } = splitFrontmatter(content);

  // Match ![alt](url) and ![alt](url "title") — capture group 1 is the URL.
  const IMG_RE = /!\[([^\]]*)\]\((https?:\/\/[^) "]+)(?:\s+"[^"]*")?\)/g;

  let newBody = body;
  let inlineIndex = 1;
  let inlineChanged = false;
  let match;

  // Collect existing inline asset filenames so we can resume numbering correctly.
  const existingInline = new Set(
    fs.readdirSync(ASSETS_DIR).filter(f => f.startsWith(`${slug}-`) && !f.endsWith("-cover.png") && !f.endsWith("-cover.webp") && !f.endsWith("-cover.jpg"))
  );

  // Reset index past any already-downloaded inline images.
  while (existingInline.has(`${slug}-${inlineIndex}${".png"}`) ||
         existingInline.has(`${slug}-${inlineIndex}${".jpg"}`) ||
         existingInline.has(`${slug}-${inlineIndex}${".webp"}`) ||
         existingInline.has(`${slug}-${inlineIndex}${".gif"}`)) {
    inlineIndex++;
  }

  // Two-pass: collect replacements first so we can apply them all at once.
  const replacements = [];
  IMG_RE.lastIndex = 0;

  while ((match = IMG_RE.exec(body)) !== null) {
    const [full, alt, url] = match;

    if (!shouldLocalise(url)) {
      console.log(`   [ SKIP ] inline image (external, not CDN): ${url}`);
      continue;
    }

    const ext = extFromUrl(url);
    const newFilename = `${slug}-${inlineIndex}${ext}`;
    const newLocalPath = `/assets/${newFilename}`;
    const destPath = path.join(ASSETS_DIR, newFilename);

    const newMarkdown = full.replace(url, newLocalPath);
    replacements.push({ full, newMarkdown, url, destPath, newLocalPath, newFilename });
    inlineIndex++;
  }

  if (replacements.length === 0 && !existingInline.size) {
    // no inline images at all
  }

  for (const { full, newMarkdown, url, destPath, newLocalPath, newFilename } of replacements) {
    if (fs.existsSync(destPath)) {
      console.log(`   [ EXIST] inline — ${newFilename} already present`);
      newBody = newBody.replace(full, newMarkdown);
      inlineChanged = true;
      continue;
    }

    console.log(`   [FETCH ] inline ${url}`);
    console.log(`            → ${newLocalPath}`);
    if (!DRY_RUN) {
      try {
        await download(url, destPath);
        newBody = newBody.replace(full, newMarkdown);
        inlineChanged = true;
        console.log(`            ✓ downloaded`);
      } catch (err) {
        console.error(`            ✗ failed: ${err.message}`);
      }
    } else {
      console.log(`            (dry run — skipped)`);
    }
  }

  if (inlineChanged && !DRY_RUN) {
    fs.writeFileSync(filePath, front + newBody);
    console.log(`   ✓ inline images updated in frontmatter`);
  }
}

console.log("\nDone.");
