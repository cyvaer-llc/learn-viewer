import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import './assets/link-external-16.svg';
import './App.css';
import CourseSelector from './components/course-selector';
import Course from './components/course';
import currentMarkdownReducer, { INITIAL_STATE } from './reducers/current-markdown-reducer';
import useCourseReducer from './reducers/course-reducer';
import { CurrentMarkdownDispatchContext } from './contexts/current-markdown';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';
import remarkCallout from './remark-plugins/remark-callout-plugin';
import remarkFixUrls from './remark-plugins/remark-fix-urls-plugin';
import './remark-plugins/remark-callout-plugin.css';
import { ClearMarkdownAction } from './reducers/markdown-actions';
import { CourseModel } from './models/course';

const COURSE_IN_QUERY = new URL(window?.location.href).searchParams.get('course');
const DEFAULT_COURSE = COURSE_IN_QUERY || 'https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c19/seattle/course.yaml';
// Some other courses tried:
// https://raw.githubusercontent.com/gSchool/ada-pre-course/master/course.yaml

function App() {
  const [courseUrl, setCourseUrl] = useState(DEFAULT_COURSE);
  const [courseState, { setCourse: setCourseModel2, setCourseError, setCourseLoading }] = useCourseReducer();
  const [mdState, dispatchMarkdown] = useReducer(currentMarkdownReducer, INITIAL_STATE);

  const loadCourseData = (courseUrl: string): () => void => {
    const abortController = new AbortController();
    const goFetch = async () => {
      setCourseLoading();
      try {
        const res = await fetch(courseUrl, { signal: abortController.signal });
        const yaml = await res.text();
        const courseModel = new CourseModel(yaml);
        setCourseModel2(courseModel);
      } catch(err: any) {
        setCourseError(err.message)
      }
    };

    goFetch();
    return () => abortController.abort();
  }

  useEffect(() => {
    const abort = loadCourseData(courseUrl);

    return () => {
      console.log("Aborting data load.");
      abort();
    }
  }, []);

  const onCourseSet = (course: string) => {
    setCourseUrl(course);
    loadCourseData(course);
  }

  const close = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dispatchMarkdown(new ClearMarkdownAction());

    const params = new URLSearchParams(window.location.search);
    params.delete('content-file-uid');
    history?.pushState({}, '', '?' + params.toString());
  }

  return (
    <CurrentMarkdownDispatchContext.Provider value={dispatchMarkdown}>
      <header>
        <h1>Learn Curriculum Viewer</h1>
        <CourseSelector course={courseUrl} setCourse={onCourseSet} />
      </header>
      <main className='split-screen'>
        { courseState.course && <Course courseModel={courseState.course} /> }
        { courseState.loading && <div className='loading'>Loading...</div> }
        { courseState.error && <div id='error'>Error Loading Course: {courseState.error}</div> }
        <div id="markdown-container">
          { mdState.currentMarkdown && 
            <div className='right-align'>
              <button className='close-btn' onClick={close}>&times;</button>
            </div> }
          { !mdState.currentMarkdown && <>&larr; Please select an item</> }
          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
              remarkCallout,
              [remarkFixUrls, { rootUrl: mdState.markdownRootUrl }]
            ]}
            rehypePlugins={[
              rehypeRaw,
              [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }]
            ]}
          >
            { mdState.currentMarkdown }
          </ReactMarkdown>
        </div>
      </main>
      <footer>
        &copy;2023 Cyvaer
      </footer>
    </CurrentMarkdownDispatchContext.Provider>
  )
}

export default App
