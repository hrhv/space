# harshitbudhraja.com

This is the repository that hosts harshitbudhraja.com

# Theme

The theme and the codebase is created from Cassidy's Blog Template which can be found here: https://cassidoo.co/. Github Repo: https://github.com/cassidoo/blahg

# Improvements in the base theme

- Introduced a dark mode toggle
- Better rendering for markdown tables

# Projects

Every project gets a homepage at `/projects/<id>/` that shares the site's look but carries its own logo, tagline and navbar. To add one:

1. Describe it in `projects/<id>.json` (name, tagline, description, logo, navbar links). The schema lives in `src/content.config.js`, and the project shows up on `/projects` automatically.
2. Put its images in `public/assets/projects/<id>/`.
3. Add pages under `src/pages/projects/<id>/`:
   - `.astro` pages wrap their content in `layouts/ProjectLayout.astro` and can contain anything. `components/projects/` has reusable pieces such as the "at a glance" facts box.
   - Markdown pages (docs, legal, changelogs) use `layout: …/layouts/ProjectArticle.astro`, which adds the title, the last-updated date and an optional table of contents (`toc: true`).

See `projects/tiku.json` and `src/pages/projects/tiku/` for a complete example.
