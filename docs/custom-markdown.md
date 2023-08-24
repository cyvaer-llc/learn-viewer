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

* Challenges
  * Start marker: `### !challenge`
  * End marker: `### !end-challenge`
  * Content is a bulleted list of key/value pairs, with keys that include:
    * type
    * id
    * title
  * "Parameters" -- these are represented by `##### !` and have a matching `##### !end-`. For example: 