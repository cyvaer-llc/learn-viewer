# Custom Markdown
Lessons and activities have custom component markdown. In Learn, these are enclosed by `### !` followed by some marker.

You can learn a bit about Learn's markdown here: [Learn Markdown](https://learn-viewer.cyvaer.com/?course=https%3A%2F%2Fraw.githubusercontent.com%2FAda-Developers-Academy%2Fcore%2Fmain%2Fonboarding%2Fcourse.yaml&section=Learning+Learn&standard=62bebb46f9b38f8f5ac6617a2852110f&content-file-uid=64c3de83840b43b5fb1394cd6fa50922)

## Callouts
These start with `### !callout-<callout-type>` and end with `### !end-callout`.

For details and more examples, see: [Callouts](./custom-markdown/callouts.md).

![Rendered info callout that contains the title "`for` Loops" and the text "An alternative syntax is to use for loops with a range. The for loop syntax sets up and modifies something like a counter variable!"](./custom-markdown/callout-info.png)

## Challenges
Challenges are in-reading quizzes, basically.

Challenge structure:
* Start marker: `### !challenge`
* End marker: `### !end-challenge`
* Content is a bulleted list of key/value pairs, with keys that include:
  * type
  * id
  * title
  * topics
* "Parameters" -- these are represented by `##### !` and have a matching `##### !end-`. For example: 

Known types:
* [ ] code-snippet [requires actually running code?]
* [x] checkbox
* [x] multiple-choice
* [ ] number [only seen in examples]
* [ ] ordering
* [ ] paragraph
* [ ] project
  * [ ] testable-project
    - BUG: `testable-project` has an `upstream` field in its metadata that contains a URL. GitHub-flavored markdown will turn this into a link, violating the expectation that everything in the list be plaintext. (For example: `* upstream: https://github.com/cyvaer-llc/testable-project` might be an entry.)
    - RECOMMENDATION: Split the challenge parsing into two phases: first, parse and remove metadata, leaving only markdown that should be turned into structure. Then, parse the metadata into hast as expected.
* [ ] short-answer
* [x] tasklist

### Parsing challenges
Each challenge needs to have its markdown presentation preserved since, for example, the question block can contain complex content such as tables. In addition, structural html components need to be generated that are particular to the data. Finally, data that is *not* presentational (such as the correct answers in a multiple-choice challenge) need to be extracted and parsed so that they can be provided to the interactive components that implement them.


### tasklist
The task list challenge type simply presents a question and a list of checkboxes.

#### Markdown Parsing
For the task list, we need to generate ids for each option. It seems easiest to just number each option starting at 0 and prepend the challenge ID.

Here's an example of a list of options we might handle:

```md
##### !options

* First task
* Second task **with emphasis**
* Third task

##### !end-options
```

Here's an example HTML representation of the AST that the plugin should send to rehype:

```html
<section challengeType='tasklist' id='amx159q' title='Example Task List' options='[amx159q0, amx159q1, amx159q2]'>
  <div className='question-options'>
    <div className='tasklist-item'>
      <input id='amx159q0' type='checkbox'>
      <label htmlFor='amx159q0'>First task</label>
    </div>
    <div className='tasklist-item'>
      <input id='amx159q1' type='checkbox'>
      <label htmlFor='amx159q1'>Second task <strong>with emphasis</strong></label>
    </div>
    <div className='tasklist-item'>
      <input id='amx159q2' type='checkbox'>
      <label htmlFor='amx159q2'>Third task</label>
    </div>
  </div>
</section>
```

Basically, each `ListItem` needs to be turned into a div with an input checkbox and a label

#### React components
`ReactMarkdown` lets us override what React components are rendered for any given tag. In this case, we can look for `challengeType` and if it's present and has a `tasklist` value, we can render a specific `TaskList` challenge.

To make the components interactive, we'll also:
* override the `input` component handling so that it looks for a `ChallengeContext`. If there's a challenge context, then it can hook up event handlers to the input field and find the value for the field by its id.
* ~~override the `label` component handling so that we can detect from the `ChallengeContext` if we need to add a "completed" visual treatment to the text in the label.~~ This can be done entirely with a css pseudoclass: `:checked + label { ... }`.

The only interactivity the challenge itself needs to provide is to display a success message when every item is complete!

### project
Content keys:
* `type`: `"project"`
* `id`: `uuid` or six-character id
* `title`: `string`
* `points`: `number`

Parameters:
* `question`: markdown
* `placeholder`: string to be used as input box placeholder.
* `rubric`: markdown

#### testable-project
Additional Content keys:
* `upstream`: url to github repo
* `validate_fork`: `boolean`
* `topics`: comma-separated list of technology names

Additional Parameters:
* [none]

### short-answer
Content keys:
* `type`: `"short-answer"`
* `id`: `uuid`
* `title`: `string`
* `points`: `number`
* `topics`: comma-separated list of technology names

Parameters:
* `question`: markdown
* `placeholder`: string to be used as input box placeholder.
* `answer`: Regex to validate the input box.