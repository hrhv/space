import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://harshitbudhraja.com",
	base: "/",
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			theme: "material-theme-darker",
			langs: [],
		},
	},
	compressHTML: true,
	// Redirects from old Hashnode root URLs → new /blog/* paths.
	// In static output mode Astro emits HTML meta-refresh pages (not HTTP 301s).
	// Real 301s are handled at the Nginx layer — see deploy/nginx-redirects.conf.
	redirects: {
		// Individual posts
		"/port-a-website-to-the-dark-web-in-under-2-minutes": {
			destination: "/blog/port-a-website-to-the-dark-web-in-under-2-minutes",
			status: 301,
		},
		"/what-is-an-api": {
			destination: "/blog/what-is-an-api",
			status: 301,
		},
		"/types-of-apis-rest-vs-soap": {
			destination: "/blog/types-of-apis-rest-vs-soap",
			status: 301,
		},
		"/using-1password-for-free-to-store-my-passwords": {
			destination: "/blog/using-1password-for-free-to-store-my-passwords",
			status: 301,
		},
		"/how-to-make-your-hashnode-blog-load-faster": {
			destination: "/blog/how-to-make-your-hashnode-blog-load-faster",
			status: 301,
		},
		"/proxy-pass-nginx": {
			destination: "/blog/proxy-pass-nginx",
			status: 301,
		},
		"/bigbaskets-first-step-towards-open-source": {
			destination: "/blog/bigbaskets-first-step-towards-open-source",
			status: 301,
		},
		"/generating-vanity-onion-addresses-for-tor-v3-hidden-services": {
			destination: "/blog/generating-vanity-onion-addresses-for-tor-v3-hidden-services",
			status: 301,
		},
		"/my-proxmox-homelab-kept-freezing-every-few-hours": {
			destination: "/blog/my-proxmox-homelab-kept-freezing-every-few-hours",
			status: 301,
		},
		"/reminders-on-slack-messages-and-even-snoozing-them": {
			destination: "/blog/reminders-on-slack-messages-and-even-snoozing-them",
			status: 301,
		},
		"/what-are-the-top-10-skills-needed-for-a-product-management-role-written-by-notion-ai": {
			destination: "/blog/what-are-the-top-10-skills-needed-for-a-product-management-role-written-by-notion-ai",
			status: 301,
		},
		// Extra published posts (not in original Phase 3 table)
		"/mysqls-weird-way-of-strip-typecasting-strings-to-integers": {
			destination: "/blog/mysqls-weird-way-of-strip-typecasting-strings-to-integers",
			status: 301,
		},
		// Old Hashnode slug had a hash suffix; redirect to cleaned-up slug
		"/making-apt-decisions-while-you-code-to-save-money-4bcf1c89dc9c": {
			destination: "/blog/making-apt-decisions-while-you-code-to-save-money",
			status: 301,
		},
		// Hashnode series index pages → tag pages
		"/series/apis": {
			destination: "/blog/tag/apis",
			status: 301,
		},
		"/series/nanobits": {
			destination: "/blog/tag/nanobits",
			status: 301,
		},
		// Old posts listing page
		"/posts": {
			destination: "/blog",
			status: 301,
		},
	},
	// Note: /sitemap.xml → /sitemap-index.xml is handled at the Nginx layer only.
	// Astro static redirects can't intercept .xml file requests (creates a dir).
	// See deploy/nginx-redirects.conf.
});
