# Challenge metadata and parameters

## Content Keys (Metadata)
Challenges contain some metadata in a markdown list immedately after the `!challenge` tag. Each entry is a `:`-separated key-value pair. Keys include:
* type
* id
* title
* topics
* points
* upstream [on `testable_project`]
* validate_fork [on `testable_project`]

## Parameters
Challenges also have sections of information *and* content embedded in them. These parameters are enclosed by tags. E.g. `!question` and `!end-question`.

**All known parameter tags:**
- `question`: Contains markdown that represents the Challenge's prompt
- `options`: A bulleted list of markdown that is the possible options.
- `answer`: The answer, which might be a single thing or multiple things in a list. The only way to know which `option` the `answer` corresponds to is to check if the markdown itself is equal. (e.g. this is the reason `extractOptionsNodesAndData` creates a `mdToIdMap`.)
- `placeholder`: The placeholder value for a text input challenge
- `rubric` 

## Challenge type specific Content Keys & Parameters

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