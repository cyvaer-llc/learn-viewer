# Design Doc

## Markdown Support
Options for markdown processing include:
* [remarkjs/react-markdown](https://github.com/remarkjs/react-markdown)
* [markdown-it](https://markdown-it.github.io/)
* [marked](https://marked.js.org/) – potentially unsafe
* [milkdown](https://milkdown.dev/docs/guide/why-milkdown) – for authoring

We'll use React Markdown because:
1. remarkjs appears to be the popular choice
2. It's easy to use.

## Curriculum structure
### Courses
The Ada curriculum is organized into a "course" for every cohort/campus. The course is described in a YAML file. For example: [c19/seattle/course.yaml](https://github.com/Ada-Developers-Academy/core/blob/main/c19/seattle/course.yaml).

> YAML parser: [js-yaml](https://www.npmjs.com/package/js-yaml)

These point at github repos that each have a `config.yaml` in them. The `config.yaml` files have a list of "Standards". These are like a list of topics. The topics are each containers for a list of lesson-like things and quizzes or checkpoints.

To get a high level prototype going, we should:
1. Parse the `course.yaml` to get the list of "sections" and their repositories.
1. For each repo, parse the `config.yaml` to get a list of "Standards"
   - Summarize all of the possible types of `ContentFiles`
   - Summarize all of the possible types of `SuccessCriteria`
   - List each `ContentFile` and its type in each Standard.

#### YAML Structure
The structure of the objects we get from the `course.yaml` are:

```JSON
{
  ":Course": [
    {
      ":Section": "Precourse",
      ":Repos": [
        {
          ":Url": "https://github.com/ada-developers-academy/ada-precourse-v2"
        }
      ]
    },
    {
      ":Section": "About Ada",
      ":Repos": [
        {
          ":Url": "https://github.com/Ada-Developers-Academy/core-about-ada"
        }
      ]
    },
    /* [...] */
  ]
}
```

Repos have their own `config.yaml`. That structure is slightly more extensive. Each repo is "section", which contains a list of "standards". These standards are like groups of lessons/exercises/activities. The lessons, exercises, activities, etc., are called "Content Files". To represent these, we've created the following models:
- [Course](../src/models/course.ts) (a `course.yaml` representation)
- [Section](../src/models/section.ts) (a list of Standards with title & url)
- [Standard](../src/models/standard.ts) (a grouping of Content Files with some metadata)
- [Content File](../src/models/content-file.ts) (metadata about an actual lesson / exercise / activity, and its actual markdown).