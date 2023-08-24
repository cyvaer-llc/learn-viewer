# Custom Markdown
Lessons and activities have custom component markdown. In Learn, these are enclosed by `### !` followed by some marker.

## Callouts
* Callouts
  * Known start markers:
    * `### !callout-info`
    * `### !callout-success`
    * `### !callout-danger`
    * `### !callout-warning`
    * `### !callout-secondary`
    * From a comment: "available callout types: info, success, warning, danger, secondary, star"
  * Known end markers:
    * `### !end-callout`
  * "Body":
    * Will contain a title after a `##` for an h2.
    * The paragraph text after this is the body of the element

## Challenges
Challenges are in-reading quizzes, basically.

Challenge structure:
* Start marker: `### !challenge`
* End marker: `### !end-challenge`
* Content is a bulleted list of key/value pairs, with keys that include:
  * type
  * id
  * title
* "Parameters" -- these are represented by `##### !` and have a matching `##### !end-`. For example: 

Known types:
* [ ] code-snippet [requires actually running code?]
* [ ] checkbox
* [ ] multiple-choice
* [ ] number [only seen in examples]
* [ ] ordering
* [ ] paragraph
* [ ] project
  * [ ] testable-project
* [ ] short-answer
* [ ] tasklist

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