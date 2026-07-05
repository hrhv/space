# Redirect Map

All old Hashnode root-level URLs redirect to their new `/blog/*` locations.

**How redirects are applied (two layers):**
1. **Astro config** (`astro.config.mjs`) — emits HTML meta-refresh pages in static output. Works at the app layer; not true HTTP 301s.
2. **Nginx** (`deploy/nginx-redirects.conf`) — true HTTP 301s. Paste into Nginx Proxy Manager's Advanced tab for `harshitbudhraja.com`. This is authoritative for SEO.

---

## Individual posts

| Old URL | New URL | Status |
|---|---|---|
| `/port-a-website-to-the-dark-web-in-under-2-minutes` | `/blog/port-a-website-to-the-dark-web-in-under-2-minutes` | 301 |
| `/what-is-an-api` | `/blog/what-is-an-api` | 301 |
| `/types-of-apis-rest-vs-soap` | `/blog/types-of-apis-rest-vs-soap` | 301 |
| `/using-1password-for-free-to-store-my-passwords` | `/blog/using-1password-for-free-to-store-my-passwords` | 301 |
| `/how-to-make-your-hashnode-blog-load-faster` | `/blog/how-to-make-your-hashnode-blog-load-faster` | 301 |
| `/proxy-pass-nginx` | `/blog/proxy-pass-nginx` | 301 |
| `/bigbaskets-first-step-towards-open-source` | `/blog/bigbaskets-first-step-towards-open-source` | 301 |
| `/generating-vanity-onion-addresses-for-tor-v3-hidden-services` | `/blog/generating-vanity-onion-addresses-for-tor-v3-hidden-services` | 301 |
| `/my-proxmox-homelab-kept-freezing-every-few-hours` | `/blog/my-proxmox-homelab-kept-freezing-every-few-hours` | 301 |
| `/reminders-on-slack-messages-and-even-snoozing-them` | `/blog/reminders-on-slack-messages-and-even-snoozing-them` | 301 |
| `/what-are-the-top-10-skills-needed-for-a-product-management-role-written-by-notion-ai` | `/blog/what-are-the-top-10-skills-needed-for-a-product-management-role-written-by-notion-ai` | 301 |
| `/mysqls-weird-way-of-strip-typecasting-strings-to-integers` | `/blog/mysqls-weird-way-of-strip-typecasting-strings-to-integers` | 301 |
| `/making-apt-decisions-while-you-code-to-save-money-4bcf1c89dc9c` | `/blog/making-apt-decisions-while-you-code-to-save-money` | 301 |

## Series index pages

| Old URL | New URL | Status |
|---|---|---|
| `/series/apis` | `/blog/tag/apis` | 301 |
| `/series/nanobits` | `/blog/tag/nanobits` | 301 |

## Other pages

| Old URL | New URL | Status |
|---|---|---|
| `/posts` | `/blog` | 301 |
| `/sitemap.xml` | `/sitemap-index.xml` | 301 |
| `/rss.xml` | `/rss.xml` | — (no change, already correct) |

## Pending decisions

- `/archive` — no equivalent found in backup exports. Decide: redirect to `/blog`, create a static archive page, or return 410 Gone.
- `/disclaimer` — no equivalent found in backup exports. Decide: redirect to `/about`, create a page, or drop.
