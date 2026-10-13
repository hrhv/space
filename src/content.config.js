import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({ pattern: "*.md", base: "./posts" }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		description: z.string(),
		added: z.union([z.string(), z.date()]),
		updated: z.union([z.string(), z.date()]).optional(),
		tags: z.array(z.string()),
		coverImage: z.string().optional(),
	}),
});

// One JSON file per project in /projects; the file name is the project's id
// and its URL, i.e. projects/tiku.json → /projects/tiku/. Pages for a project
// live in src/pages/projects/<id>/ and use layouts/ProjectLayout.astro.
const projects = defineCollection({
	loader: glob({ pattern: "*.json", base: "./projects" }),
	schema: z.object({
		name: z.string(),
		// Shown under the name in the project header.
		tagline: z.string(),
		// Meta description, and the blurb on /projects.
		description: z.string(),
		// Paths in /public. The logo doubles as the social card image.
		logo: z.string(),
		favicon: z.string().optional(),
		added: z.union([z.string(), z.date()]),
		// Project navbar, after the link to the project's homepage.
		nav: z
			.array(z.object({ label: z.string(), href: z.string() }))
			.default([]),
	}),
});

export const collections = { posts, projects };
