import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || "main";

export default defineConfig({
	branch,
	clientId: process.env.TINACLIENTID, // Get this from tina.io
	token: process.env.TINATOKEN, // Get this from tina.io

	build: {
		outputFolder: "admin",
		publicFolder: "public",
	},
	media: {
		tina: {
			mediaRoot: "assets",
			publicFolder: "public",
		},
	},
	schema: {
		collections: [
			{
				label: "Site Settings",
				name: "settings",
				path: "src/settings",
				format: "json",
				fields: [
					{
						type: "string",
						label: "Name",
						name: "name",
					},
					{
						type: "string",
						label: "Site Title",
						name: "title",
					},
					{
						type: "string",
						label: "Site Subtitle",
						name: "subtitle",
					},
					{
						type: "object",
						label: "Social Links",
						name: "social",
						fields: [
							{ type: "string", label: "GitHub", name: "github" },
							{ type: "string", label: "LinkedIn", name: "linkedin" },
							{ type: "string", label: "Twitter / X", name: "twitter" },
							{ type: "string", label: "YouTube", name: "youtube" },
							{ type: "string", label: "Bluesky", name: "bluesky" },
						],
					},
					{
						type: "string",
						label: "Photo",
						name: "photo",
					},
				],
				ui: {
					allowedActions: {
						create: false,
						delete: false,
					},
				},
			},
			{
				name: "post",
				label: "Posts",
				path: "posts",
				defaultItem: () => ({
					title: "New Post",
					added: new Date(),
					tags: [],
				}),
				ui: {
					dateFormat: "MMM DD YYYY",
					filename: {
						readonly: false,
						slugify: (values) => {
							return values?.slug?.toLowerCase().replace(/ /g, "-");
						},
					},
				},
				fields: [
					{
						name: "title",
						label: "Title",
						type: "string",
						isTitle: true,
						required: true,
					},
					{
						label: "Slug",
						name: "slug",
						type: "string",
						required: true,
					},
					{
						label: "Description",
						name: "description",
						type: "string",
						required: true,
					},
					{
						label: "Tags",
						name: "tags",
						type: "string",
						list: true,
					},
					{
						label: "Added",
						name: "added",
						type: "datetime",
						dateFormat: "MMM DD YYYY",
						required: true,
					},
					{
						label: "Updated",
						name: "updated",
						type: "datetime",
						dateFormat: "MMM DD YYYY",
					},
					{
						label: "Cover Image",
						name: "coverImage",
						type: "image",
					},
					{
						type: "rich-text",
						name: "body",
						label: "Body",
						isBody: true,
					},
				],
			},
		],
	},
	search: {
		tina: {
			indexerToken: process.env.TINASEARCH,
			stopwordLanguages: ["eng"],
		},
		indexBatchSize: 50,
		maxSearchIndexFieldLength: 100,
	},
});
