# Initial Design Doc

## Markdown Support
Options for markdown processing include:
* [remarkjs/react-markdown](https://github.com/remarkjs/react-markdown)
* [markdown-it](https://markdown-it.github.io/)
* [marked](https://marked.js.org/) – potentially unsafe
* [milkdown](https://milkdown.dev/docs/guide/why-milkdown) – for authoring

We'll use React Markdown because:
1. remarkjs appears to be the popular choice
2. It's easy to hook up.

### Remark Configuration
Things to do or consider:
- [x] We may be able to use `transformLinkUri` for relative links?
      - Or might need [remark-link-rewrite](https://github.com/rjanjic/remark-link-rewrite)
      - Started with a custom solution, just to get images loading. HOWEVER, relative links between `.md` files get treated as external links!
- [ ] Syntax highlighting that detects `language-` prefixed classes on a `code` tag.
      - Maybe [rehype-highlight](https://github.com/rehypejs/rehype-highlight)?
      - Maybe [remark-prism](https://github.com/sergioramos/remark-prism)?
      - Maybe [remark-torchlight](https://github.com/torchlight-api/remark-torchlight)?
- [ ] Code Sandbox for code that is supposed to be runnable? [remark-codesandbox](https://github.com/kevin940726/remark-codesandbox)
- [ ] Use `rehype-sanitize`` to sanitize the input markup, but also override it (possibly using its [Schema](https://github.com/syntax-tree/hast-util-sanitize#schema) API?) in order to allow the embedded videos that are iframes.

### Plugins
The first issue we run into is that there is heavy customization of the markdown in the curriculum. For example, callouts are a special snowflake, and there aren't any existing plugins that handle them:

```md
<!-- available callout types: info, success, warning, danger, secondary  -->
### !callout-info

## `table_name.column_name` Syntax

We are using the syntax `table_name.column_name` to differentiate between columns in the `clients` table and columns in the `rentals` table. In cases where the column names do not conflict, this is optional, but explicitly referring to the table can help remind us what the source of the data is.

### !end-callout
```

One path forward might be to write plugins for each special syntax override. Here's an example I found of a custom plugin written to handle callouts: [@portaljs/remark-callouts](https://www.npmjs.com/package/@portaljs/remark-callouts) ([src](https://github.com/datopian/portaljs/blob/main/packages/remark-callouts/src/lib/remark-callouts.ts)). If only they had been written with a directive syntax so that we could use [Microflash/remark-callout-directives](https://github.com/Microflash/remark-callout-directives#example-callout-with-custom-title)!

A similar example for plugins might be [remark-hint](https://github.com/sergioramos/remark-hint).

## Curriculum structure
See: [Curriculum Structure](./curriculum-structure.md)
