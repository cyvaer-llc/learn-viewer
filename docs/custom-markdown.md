# Custom Markdown
Lessons and activities have custom component markdown. In Learn, these are enclosed by `### !` followed by some marker.

You can learn a bit about Learn's markdown here: [Learn Markdown](https://learn-viewer.cyvaer.com/?course=https%3A%2F%2Fraw.githubusercontent.com%2FAda-Developers-Academy%2Fcore%2Fmain%2Fonboarding%2Fcourse.yaml&section=Learning+Learn&standard=62bebb46f9b38f8f5ac6617a2852110f&content-file-uid=64c3de83840b43b5fb1394cd6fa50922)

## Callouts
These start with `### !callout-<callout-type>` and end with `### !end-callout`.

For details and more examples, see: [Callouts](./custom-markdown/callouts.md).

![Rendered info callout that contains the title "`for` Loops" and the text "An alternative syntax is to use for loops with a range. The for loop syntax sets up and modifies something like a counter variable!"](./custom-markdown/callout-info.png)

## Challenges
These start with `### !challenge` and end with `### !end-challenge`. They have a complex set of metadata and parameters, also encoded in special `!` tags in markdown.

For more details, see: [Challenges](./custom-markdown/challenges.md).