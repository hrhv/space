// Turns ```embed fenced code blocks into iframes, so a post can run its own
// HTML, CSS and JS without any of it leaking into the page. The block holds
// either a path to an HTML file in /public, e.g.
//
//   ```embed
//   /embeds/cpu-time-slicing.html
//   ```
//
// or the raw HTML itself. A fenced block is used (rather than raw HTML in the
// markdown) because TinaCMS's rich-text editor keeps code blocks intact.
// Sizing and theming of the iframes live in components/HtmlEmbeds.astro.

const escapeAttr = (value) =>
	value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export default {
	name: "html-embed",
	code(node, ctx) {
		if (node.lang !== "embed") return;

		const body = node.value.trim();
		const isPath = !body.includes("<") && /^\S+\.html?$/.test(body);
		const source = isPath
			? `src="${escapeAttr(body)}"`
			: `srcdoc="${escapeAttr(body)}"`;

		ctx.replaceNode(node, {
			type: "html",
			value: `<iframe class="html-embed" ${source} loading="lazy" title="Interactive embed"></iframe>`,
		});
	},
};
