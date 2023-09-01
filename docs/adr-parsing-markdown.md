# Architecture Decision Record

## Options
1. Parse markdown and use custom HTML component handlers to insert React components
1. Insert MDX nodes into the tree in order to render custom components

## Tradeoffs
### Custom HTML handlers
We're trying to generate a lot of custom HTML, and there are basically "sub-components" to be rendered for the different challenge types.

### MDX nodes
We *could* insert React components into the markdown "directly" with a plugin. This would make it a little simpler to manage the structure of individual challenge types, because the structure and styling would be the responsibility of JUST the React component, rather than the structure being formed by the remark plugin (via what HTML it produces) and then the behavior being grafted onto that structure with React components that override HTML component behavior.

One potential challenge here is we'd want each Challenge component to render markdown on its own. Essentially, a `ReactMarkdown` component would get nested inside a `ReactMarkdown` component. Maybe that's okay?

Issues:
* MDX seems to require `import` statements in order to load custom components. This may mean it's not really appropriate to use it in browser, and that it's really for SSR.
* Fundamentally, MDX is compiling markdown into JS. Using the MDX compiler in the browser means `eval`ing code, and because we're loading the markdown from arbitrary github locations entered by the user and controllable via QS params, that feels a little too dangerous.

## Decision
For now, continue with Custom HTML handlers. MDX is dangerously overkill for simply inserting custom components into the markdown AST.