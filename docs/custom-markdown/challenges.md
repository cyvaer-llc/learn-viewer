# Challenges

## Implementation
These are the known types that we're in the process of implementing:
* [ ] code-snippet
  - _appears to require running code_
* [x] checkbox
* [x] multiple-choice
* [ ] number
  - _haven't seen an example of one of these in markdown, only seen it listed as an option_
* [ ] ordering
* [ ] paragraph
* [ ] project
  * [ ] testable-project
    - _appears to require docker?_
* [ ] short-answer
* [x] tasklist

## Structure
Challenges are enclosed with `!challenge` and `!end-challenge`.

Challenges contain some metadata in a markdown list immedately after the `!challenge` tag. Each entry is a `:`-separated key-value pair. Challenges also have sections of information *and* content embedded in them. These parameters are enclosed by tags. E.g. `!question` and `!end-question`.

More info about the known metadata and parameter tags: [Challenge metadata and parameters](challenge-type-parameters.md)

## Parsing and rendering
Loading Challenges for the app presents a...challenge. That's because the markdown contains both presentational data and metadata for the challenge. Additionally, what data is present in a challenge depends on its type.

Each challenge needs to have its markdown presentation preserved. Questions and options can contain complex content such as tables and code blocks. In addition, structural html components need to be generated that are particular to the data. Finally, data that is *not* presentational (such as the correct answers in a `multiple-choice` challenge) need to be extracted and parsed so that they can be provided to the interactive components that implement them.

### ReactMarkdown
`react-markdown` relies on the parsing and plugin ecosystem provided by `unist` and its language-specific flavors, `mdast` and `hast`. `mdast` is the markdown Abstract Syntax Tree (AST) library, and `hast` is the AST library for HTML. The markdown parsing process for `react-markdown` basically goes like:

1. Parse the raw markdown with `remark`. This gets you an `md` AST.
1. Pass the markdown AST through any `remark` plugins that can modify it, which includes our `remark-challenge-plugin`
1. Then, pass the markdown AST through `rehype`, which will turn it into an HTML AST. `rehype` plugins get applied here, too.
1. After `rehype` finishes producing the HTML AST, generate React nodes for all of the HTML elements.

### Custom Remark plugin
The parsing is done as part of a custom `remark` plugin. See: [remark-challenge-plugin/index.ts](../../src/remark-plugins/remark-challenge-plugin/index.ts). As-is, this plugin parses the metadata stored in the markdown **and also** generates HTML (embedded into the `mdast`, ready to be transformed into `hast` -- see the format in [generate-node.ts](../../src/remark-plugins/remark-challenge-plugin/generate-node.ts)).

The challenge metadata is stored in a `ChallengeInfo`. See: [md-to-js-parse.ts](../../src/remark-plugins/remark-challenge-plugin/md-to-js-parse.ts).

The options and answers are parsed out of the markdown and added to the `ChallengeInfo`, as well, and the challenge info is added to the root of the element that is generated for the challenge (which is a `section` hast element).

#### Markdown Parsing
For challenges that have multiple options and answers that correspond to those options (`checkbox` and `multiple-choice`, for example), we need to generate ids for each option. It's easiest to just number each option starting at 0 and prepend the challenge ID.

Here's an example of a list of options we might handle:

```md
##### !options

* First task
* Second task **with emphasis**
* Third task

##### !end-options
```

Here's an example HTML representation of the AST that the plugin sends to rehype:

```html
<section challengeType='tasklist' id='amx159q' title='Example Task List' options='[amx159q-option-0, amx159q-option-1, amx159q-option-2]'>
  <div className='question-options'>
    <div className='tasklist-item'>
      <input id='amx159q-option-0' type='checkbox'>
      <label htmlFor='amx159q-option-0'>First task</label>
    </div>
    <div className='tasklist-item'>
      <input id='amx159q-option-1' type='checkbox'>
      <label htmlFor='amx159q-option-1'>Second task <strong>with emphasis</strong></label>
    </div>
    <div className='tasklist-item'>
      <input id='amx159q-option-2' type='checkbox'>
      <label htmlFor='amx159q-option-2'>Third task</label>
    </div>
  </div>
</section>
```

Basically, each `ListItem` needs to be turned into a div with an input checkbox and a label.

#### Handling Challenge state
We had to figure out some way to insert interactivity into the output of `ReactRemark`. After [considering MDX as an alternative](../adr-parsing-markdown.md), we settled on overriding specific tags with React components, and using `Context` to connect children to ancestors.

See: the [Document](../../src/components/document.tsx) component, which specifies what other React components will implement which `hast` tags.

Challenge context is contained in the `Document`, and allows components to share state regardless of where `ReactMarkdown` ends up placing them in the tree. For example, `Challenge` is responsible for initializing state with `ChallengeInfo` that it gets passed from the `hast` output. `Checkbox` is able to get access to the challenge state via context and update the selected options for a challenge.

This setup is a bit of a compromise: it would be nice to just write a `Tasklist` component to be the presentation of a `tasklist` challenge, and have it contain all of the state internally, as well as being responsible for rendering the structure of the task list and its checkboxes. The issue with that approach is that parts of the raw markdown, like the `question` and each individual list item from the `options` would have to be preserved, then such a `Tasklist` component would have to be responsible for rendering markdown internally. It's actually more straightforward to just let the plugin be responsible for emitting the `hast` structure like it expects to, and hook/override the components.

#### Reducers and Context
All of the state management for challenges can be found in [challenge-reducers.ts](../../src/reducers/challenge-reducer.ts), and the context providing it is in [contexts/challenge.ts](../../src/contexts/challenge.ts)