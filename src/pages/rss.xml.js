import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { title, subtitle } from "../settings/settings.json";

let posts = await getCollection("posts");

posts = posts.sort(
	(a, b) =>
		new Date(b.data.updated || b.data.added).valueOf() -
		new Date(a.data.updated || a.data.added).valueOf()
);

export const GET = async (context) => {
	const items = await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			return {
				link: `${context.site}blog/${post.data.slug}/`,
				title: post.data.title,
				pubDate: new Date(post.data.added),
				description: post.data.description,
				customData: post.data.updated
					? `<updated>${post.data.updated}</updated>`
					: "",
			};
		})
	);

	return rss({
		title: title || "",
		description: subtitle || "",
		site: context.site,
		items,
		stylesheet: "/rss-styles.xsl",
	});
};
