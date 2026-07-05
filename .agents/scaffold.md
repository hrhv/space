# Blog Migration Prompt — Hashnode → Astro (blahg template)

**Context for Claude Code:** This is a migration of a personal blog from Hashnode
(currently hosted at the root of `harshitbudhraja.com`) to a self-hosted Astro
site based on the open-source template `cassidoo/blahg`
(https://github.com/cassidoo/blahg). The final site will live at
`harshitbudhraja.com/blog/*`, with the root `/` becoming a new personal
homepage, and all old Hashnode URLs 301-redirected to their new `/blog/*`
location to preserve SEO.

Work through the phases **in order**. Do not skip ahead. At the end of each
phase, stop, summarize what was done, and wait for confirmation before
proceeding to the next phase — unless told otherwise.

**Starting point:** The `cassidoo/blahg` template is already cloned into the
current working directory. Do not re-clone it. Start by inspecting the
existing repo structure (file tree, `package.json`, `astro.config.mjs`,
whether TinaCMS is still present, existing git history) before making any
changes, and report what you find at the start of Phase 0.

---

## Phase 0 — Repo Audit & Cleanup

**Goal:** Understand the current state of the already-cloned repo and strip parts we don't need.

1. Run a full file tree scan and read `package.json`, `astro.config.mjs`, and any content collection config. Report the actual structure back to me — don't assume it matches the upstream blahg repo exactly, since it may have been modified since cloning.
2. Check git status/history — if this is still pointed at `cassidoo/blahg` as a remote, remove that remote (`git remote remove origin`) so we don't accidentally push here later. Leave history intact unless told to squash it.
3. Remove TinaCMS entirely unless explicitly told to keep it:
   - Delete the `tina/` directory if present.
   - Remove `tinacms` and related packages from `package.json`.
   - Remove the `npx tinacms dev -c 'astro dev'` script variants; keep plain `astro dev`.
   - Remove any TinaCMS provider/wrapper imports from layout or config files.
4. Install dependencies (if not already installed) and confirm `npm run dev` boots cleanly on `localhost:4321`.
5. Confirm `.gitignore` excludes `node_modules`, `.env*`, `dist/`, `.astro/` — add any missing entries.

**Output for this phase:** Show the actual current file tree, confirm the app runs locally, list what was removed/changed, and confirm the `cassidoo/blahg` git remote is gone.

---

## Phase 1 — Site Identity & Config

**Goal:** Rebrand the template from Cassidy's site to Harshit's.

1. Update `astro.config.mjs`:
   - Set `site` to `https://harshitbudhraja.com`.
   - Ensure the blog is configured to build under the `/blog` base path (site pages under `blog/`, e.g. `src/pages/blog/...` or equivalent per Astro's routing — inspect the template's actual routing approach first and adapt accordingly, don't assume file paths blindly).
2. Update `src/settings/settings.json` (or wherever site-wide settings live) with:
   - Name: Harshit Budhraja
   - Title/tagline: (placeholder — ask me for the final tagline if not obvious from `harshitbudhraja.com`'s old meta description: "Experimenting my way through & writing about a plethora of 'geeky' stuff — from open-source & JavaScript to APIs & Dark Web — product and engineering enthusiast 🚀")
   - Social links: GitHub (`https://github.com/hrhv`), LinkedIn (`https://linkedin.com/in/harshitbudhraja`), Twitter/X (`https://twitter.com/harshitbudhraja`)
3. Update `src/components/Header.astro`:
   - Replace Cassidy's name/photo with placeholders `{{NAME}}` and `{{PHOTO_PATH}}` I will fill in, plus nav links: Home, Blog, GitHub, LinkedIn.
   - Keep the persistent/sticky header behavior intact — do not remove this UX pattern.
4. Update `BaseHead.astro` meta tags: title, `twitter:creator`, `og:` tags, `meta-google-site-verification` (leave as empty placeholder).
5. Update `public/robots.txt` with the correct domain.
6. Replace `public/` images (favicon, og-image, face photo) with placeholder files I'll swap in later — do NOT invent or fetch real images.

**Output for this phase:** List every file changed with a one-line description of the change. Flag anything you were unsure about instead of guessing.

---

## Phase 2 — Homepage Redesign (root `/`)

**Goal:** The root domain currently *is* the blog on Hashnode. We're splitting it: `/` becomes a personal landing page, `/blog` becomes the blog.

1. Build a new homepage (`src/pages/index.astro`) styled consistently with the blahg header/theme, containing:
   - Name, photo, short bio (placeholder text, mark clearly with `<!-- TODO: replace bio -->`)
   - Links to: Blog (`/blog`), GitHub, LinkedIn, Twitter, resume (`https://i.harshitbudhraja.com/resume`)
   - A "Latest posts" preview section (3–5 most recent posts pulled from the blog content collection)
2. Make sure the homepage and blog share the same header/footer components — no duplicated layout code.
3. Confirm the persistent header pattern from Cassidy's site (name + photo + nav, sticky) is used consistently across `/` and `/blog/*`.

**Output for this phase:** Show the homepage file and describe how it pulls "latest posts" from content collections.

---

## Phase 3 — Content Migration

**Goal:** Migrate all 13 existing Hashnode posts into the new Astro content collection, preserving exact slugs.

Here is the full list of existing posts and their **current live URLs** (root-level on `harshitbudhraja.com`) that must map 1:1 to new slugs under `/blog/`:

| Old URL (root) | New URL (`/blog/*`) |
|---|---|
| `/port-a-website-to-the-dark-web-in-under-2-minutes` | `/blog/port-a-website-to-the-dark-web-in-under-2-minutes` |
| `/what-is-an-api` | `/blog/what-is-an-api` |
| `/types-of-apis-rest-vs-soap` | `/blog/types-of-apis-rest-vs-soap` |
| `/using-1password-for-free-to-store-my-passwords` | `/blog/using-1password-for-free-to-store-my-passwords` |
| `/how-to-make-your-hashnode-blog-load-faster` | `/blog/how-to-make-your-hashnode-blog-load-faster` |
| `/proxy-pass-nginx` | `/blog/proxy-pass-nginx` |
| `/bigbaskets-first-step-towards-open-source` | `/blog/bigbaskets-first-step-towards-open-source` |
| `/generating-vanity-onion-addresses-for-tor-v3-hidden-services` | `/blog/generating-vanity-onion-addresses-for-tor-v3-hidden-services` |
| `/my-proxmox-homelab-kept-freezing-every-few-hours` | `/blog/my-proxmox-homelab-kept-freezing-every-few-hours` |
| `/reminders-on-slack-messages-and-even-snoozing-them` | `/blog/reminders-on-slack-messages-and-even-snoozing-them` |
| `/what-are-the-top-10-skills-needed-for-a-product-management-role-written-by-notion-ai` | `/blog/what-are-the-top-10-skills-needed-for-a-product-management-role-written-by-notion-ai` |
| `/series/apis` (series index — may become a tag instead) | `/blog/tag/apis` or equivalent |
| `/series/nanobits` (series index) | `/blog/tag/nanobits` or equivalent |

Note: I count 11 individual posts confirmed by URL plus 2 "series" index pages above — there may be 1–2 additional posts not yet listed (the Hashnode homepage said "13 posts" / "12 posts" at different times). **Ask me to paste the full Hashnode post export/list before finalizing this table if the count doesn't reconcile** — do not silently drop or invent posts.

Steps:

1. I will provide the raw exported markdown/HTML for each post (via Hashnode's GitHub backup export, or pasted manually). Do not fetch these from the live internet yourself.
2. For each post, create a file at `posts/<exact-old-slug>.md` (filename = old slug, so the route matches exactly).
3. Frontmatter per post must include at minimum: `title`, `pubDate` (preserve original publish date), `description`, `tags` (map Hashnode "series" to `tags` where reasonable — e.g. posts under the "Demystifying APIs" series get tag `apis`).
4. Convert any Hashnode-specific embeds/shortcodes to plain markdown or standard HTML.
5. Fix internal cross-links inside post bodies that point to other old post URLs — rewrite them to the new `/blog/<slug>` form.
6. Preserve external links (Twitter, GitHub, etc.) unchanged.

**Output for this phase:** After each batch of posts is added, list the filenames created and flag any post where frontmatter fields were guessed/incomplete.

---

## Phase 4 — Redirects (SEO preservation)

**Goal:** Every old root-level URL must 301-redirect to its new `/blog/*` location. This is the most important phase for not breaking SEO — be precise.

1. Inspect Astro's built-in `redirects` config option in `astro.config.mjs` (available in recent Astro versions). Use it to define a static redirect map, one entry per row in the Phase 3 table (old slug → new `/blog/...` path).
2. Confirm Astro emits these as real HTTP 301s in static/server output (check Astro docs behavior for the configured output mode — `static` vs `server` — and tell me which applies here and why).
3. If Astro's native redirects don't cover a case (e.g., due to the deploy target), fall back to generating an Nginx Proxy Manager–compatible redirect snippet as a secondary artifact (`deploy/nginx-redirects.conf`) that I can paste into NPM manually. Generate this regardless, as a backup, even if Astro handles it natively.
4. Also add redirects/handling for:
   - `/sitemap.xml` → make sure the new Astro sitemap integration serves this at the same path.
   - `/rss.xml` → same, new Astro RSS feed at the same path.
   - `/archive` and `/disclaimer` → decide with me where these live in the new structure before redirecting.
5. Write a short `REDIRECTS.md` in the repo documenting every old→new mapping for future reference.

**Output for this phase:** Show the full `redirects` block from `astro.config.mjs`, the `nginx-redirects.conf` fallback file, and `REDIRECTS.md`.

---

## Phase 5 — SEO & Feeds

1. Add/verify `@astrojs/sitemap` integration, scoped correctly so it reflects the new `/blog/*` URLs.
2. Add/verify RSS feed generation (`@astrojs/rss` or the template's existing approach) pointing at `/blog/*` posts, output at `/rss.xml`.
3. Ensure canonical URLs in post pages point to `https://harshitbudhraja.com/blog/<slug>`.
4. Double check `robots.txt` references the correct sitemap URL.

**Output for this phase:** Confirm sitemap and RSS build correctly locally (`npm run build && npm run preview`), and paste sample output of both files.

---

## Phase 6 — Build, Local QA, and Deployment Prep

**Goal:** Prepare for Dokploy deployment (self-hosted, not Netlify).

1. Confirm `npm run build` produces a static `dist/` output with no errors.
2. Write a minimal `Dockerfile` for a static Astro build served via Nginx (multi-stage: build with Node, serve with `nginx:alpine`), since this will deploy on Dokploy alongside the existing homelab services.
3. Write a `docker-compose.yml` (or Dokploy-compatible config) for local testing of the container.
4. Write a short `DEPLOY.md` covering: build command, container port, expected env vars (if any), and where to point Nginx Proxy Manager for `harshitbudhraja.com`.
5. Do a final local pass:
   - Every old URL from the Phase 3 table redirects correctly when tested locally.
   - Header is sticky/persistent across `/` and all `/blog/*` pages.
   - All 11–13 posts render with correct dates, tags, and no broken internal links.

**Output for this phase:** Summarize the full repo structure, confirm all checks pass, and list any manual steps I still need to do (DNS, NPM config, image uploads, final bio copy, actual photo).

---

## Rules for every phase

- Never invent content (bio text, post content, images) — use clearly marked placeholders instead and tell me what's needed.
- Never fetch live data from `harshitbudhraja.com` or Hashnode yourself — I will paste exports/content directly.
- Keep the repo public-safe: no secrets, tokens, or `.env` values committed.
- Prefer configuration-driven changes (astro.config.mjs, settings.json) over hardcoding values across multiple files.
- If Astro's actual template structure differs from assumptions made in this prompt (e.g. routing conventions, content collection schema), inspect the real files first and adapt — flag the deviation to me rather than silently working around it.