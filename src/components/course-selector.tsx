import React, { useContext, useEffect, useState } from 'react';
import './course-selector.css';
import Combobox from 'react-widgets/Combobox';
import { CourseSettersContext, CourseStateContext } from '../contexts/current-course';
import { CourseModel } from '../models/course';
import { GithubUrl } from '../models/github-url';

type CourseSelectorProps = {
}

const courseFromQuery = () => new URL(window?.location.href).searchParams.get('course');

const KNOWN_COURSE_URLS: [string, string][] = [
  ['Ada Core Curriculum', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/course.yaml'],
  ['Ada Precourse', 'https://raw.githubusercontent.com/gSchool/ada-pre-course/master/course.yaml'],
  ['Ada C19 Atlanta', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c19/atlanta/course.yaml'],
  ['Ada C19 Digital', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c19/digital/course.yaml'],
  ['Ada C19 Seattle', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c19/seattle/course.yaml'],
  ['Ada Accelerate C2', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/ac2/course.yaml'],
  ['Ada C18 Atlanta', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c18/atlanta/course.yaml'],
  ['Ada C18 Digital', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c18/digital/course.yaml'],
  ['Ada C18 Seattle', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c18/seattle/course.yaml'],
  ['Ada Accelerate C1', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/accelerate/course.yaml'],
  ['Ada C17 Digital', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c17/digital/course.yaml'],
  ['Ada C17 Seattle', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c17/seattle/course.yaml'],
  ['Ada C16', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/C16/course.yaml'],
  ['Ada C15 "Paper" Classroom', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c15/paper/course.yaml'],
  ['Ada C15 "Rock" Classroom', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c15/rock/course.yaml'],
  ['Ada C15 "Scissors" Classroom', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c15/scissors/course.yaml'],
  ['Sandbox', 'https://github.com/Ada-Developers-Academy/core/blob/main/sandbox/course.yaml'], // Using the non-raw URL tests that we're handling those correctly.
  ['Ada Core Curriculum (Sandbox)', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/core-sandbox/course.yaml'],
  ['Ada Instructor Onboarding', 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/onboarding/course.yaml']
];

const DEFAULT_COURSE = courseFromQuery() || KNOWN_COURSE_URLS[0][1];

export default function CourseSelector(_props: CourseSelectorProps) {
  const [ course, setCourse ] = useState(DEFAULT_COURSE);
  const { setCourseLoading, setCourse: setCourseModel, setCourseError } = useContext(CourseSettersContext)!;
  const courseState = useContext(CourseStateContext)!;

  const loadCourseData = (courseUrl: string): () => void => {
    const abortController = new AbortController();
    const goFetch = async () => {
      setCourseLoading();
      try {
        const courseGhUrl = new GithubUrl(courseUrl);
        const res = await fetch(courseGhUrl.courseYamlUrl(), { signal: abortController.signal });
        const yaml = await res.text();
        const courseModel = new CourseModel(yaml);
        setCourseModel(courseModel);
      } catch(err: any) {
        setCourseError(err.message)
      }
    };

    goFetch();
    return () => abortController.abort();
  }

  useEffect(() => {
    const abort = loadCourseData(course);

    return () => {
      console.log("Aborting data load.");
      abort();
    }
  }, []);

  const [selected, setSelected] = useState<[string, string] | string>(DEFAULT_COURSE);
  const [data, setData] = useState<[string, string][]>(KNOWN_COURSE_URLS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("course", course);
    history?.pushState({}, '', '?' + params.toString());
  }, [course]);

  const onComboChange = (val: [string, string] | string) => {
    if (!Array.isArray(val) && !data.find((item) => item[1] === val)) {
      // If we don't already have `val` in the list of data, add it
      const strval = val as string;
      setData([...data, [strval, strval]]);
    }
    setSelected(val);
  }

  const formSubmitted = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onComboSelect(selected);
  };

  const onComboSelect = (val: [string, string] | string) => {
    const courseUrl = Array.isArray(val) ? val[1] : val;
    setCourse(courseUrl);
    loadCourseData(courseUrl);
  };
  
  return (
    <form id='course-selector' className='flex-grow horizontal' onSubmit={ formSubmitted }>
      <Combobox
        className='flex-grow'
        defaultValue={ DEFAULT_COURSE }
        data={ KNOWN_COURSE_URLS }
        dataKey={ '1' }
        textField={ '0' }
        hideEmptyPopup={ true }
        onChange={ onComboChange }
        onSelect={ onComboSelect }
        renderListItem={({ item }) => (
          <div className='course-group'>
            <div className='course-name'>{item[0]}</div>
            <div className='course-url'>{ new GithubUrl(item[1]).githubUrl() }</div>
          </div>
        )}
        busy={ courseState.loading }
      />
      <button type="submit">Load</button>
    </form>
  )
}