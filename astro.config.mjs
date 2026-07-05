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
});
