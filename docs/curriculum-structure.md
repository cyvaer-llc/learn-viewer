# Curriculum Structure
## Overview
The friendliest way to learn about how curriculum information is structured and organized is actually to use the viewer itself to access Ada's open source [Learning Learn curriculum](https://learn-viewer.cyvaer.com/?course=https%3A%2F%2Fraw.githubusercontent.com%2FAda-Developers-Academy%2Fcore%2Fmain%2Fonboarding%2Fcourse.yaml&section=Learning+Learn). This curriculum is written in the same curriculum format you'll learn about, and explains how the files are created in the Learn LMS environment.

The most relevant concepts are:
- [Course.yaml](https://learn-viewer.cyvaer.com/?course=https%3A%2F%2Fraw.githubusercontent.com%2FAda-Developers-Academy%2Fcore%2Fmain%2Fonboarding%2Fcourse.yaml&section=Learning+Learn&content-file-uid=cdf50283b41c500b0670e5d89343b8f4&standard=5416bdc5b988be692318a7a903ddac1d): introducing how course metadata is structured.
- [Config vs. Autoconfig](https://learn-viewer.cyvaer.com/?course=https%3A%2F%2Fraw.githubusercontent.com%2FAda-Developers-Academy%2Fcore%2Fmain%2Fonboarding%2Fcourse.yaml&section=Learning+Learn&content-file-uid=b839e19273b7dbb70814cab8658ade6b&standard=5416bdc5b988be692318a7a903ddac1d): for understanding `config.yaml`, which structures a particular section of a course.
- [Learn Markdown](https://learn-viewer.cyvaer.com/?course=https%3A%2F%2Fraw.githubusercontent.com%2FAda-Developers-Academy%2Fcore%2Fmain%2Fonboarding%2Fcourse.yaml&section=Learning+Learn&standard=62bebb46f9b38f8f5ac6617a2852110f&content-file-uid=64c3de83840b43b5fb1394cd6fa50922): explains the special markdown tags in courses.

## Courses
Learn curricula are organized into a "course". The curriculum for Ada Developers Academy makes a course for every cohort/campus. The course is described in a YAML file. For example, Ada's C19 Seattle campus curriculum is: [c19/seattle/course.yaml](https://github.com/Ada-Developers-Academy/core/blob/main/c19/seattle/course.yaml).

So the root of a curriculum is one of these `course.yaml` files. Therefore, the Learn Viewer loads the `course.yaml` file provided in the course selector and parses it with a YAML parser, [js-yaml](https://www.npmjs.com/package/js-yaml).

### YAML Structure
The `course.yaml` has the following structure:
- A root object with a single `":Course"` key, which is a list of sections.
- Each section is an object that has a `":Section"`, its title, and a `":Repos"`, which is an array of objects that have a `":Url"` for the repo.

For example:

```JSONC
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
    /* ... */
  ]
}
```

Each of the URLs in a `:Repos` list should point at a repository that has a `config.yaml` in it. This config describes an individual "section".

## Sections
Repos have their own `config.yaml` and contain information about a "section". Ada's curriculum uses Sections for its high level curriculum breakdown, e.g. Units 1-3, CS Fundamentals, Precourse, etc.

The structure of a `config.yaml` for a Section is slightly more extensive than a course. Each section repo's `config.yaml` contains a list of "standards". These standards are like groups of lessons/exercises/activities within a given Section. The lessons, exercises, activities, etc., are called "Content Files".

## Data Model
To represent the structure of Courses and their Sections, we've created the following models:
- [Course](../src/models/course.ts) (a `course.yaml` representation)
- [Section](../src/models/section.ts) (a list of Standards with title & url)
- [Standard](../src/models/standard.ts) (a grouping of Content Files with some metadata)
- [Content File](../src/models/content-file.ts) (metadata about an actual lesson / exercise / activity, **and** its actual markdown loaded from a `.md` file).

## Loading Courses and Sections
We lazily-load course and section information to prevent the app from fanning out and loading hundreds of markdown files all at once. Loading looks like this:

1. Parse the `course.yaml` file to get the list of Sections inside the Course (and, most importantly, their repository URLs).
1. When one of the Sections is expanded in the nav bar, retrieve its `config.yaml` and show metadata about each of the Standards inside that Section (specifically, title and description).
1. When one of the Standards inside the Section is expanded, load each of the markdown files in order to retrieve its title.
1. When one of the Content Files is selected, render its markdown in the right-side Document area.

