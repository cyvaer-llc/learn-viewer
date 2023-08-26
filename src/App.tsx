import { SyntheticEvent, useReducer } from 'react';
import './assets/link-external-16.svg';
import './App.css';
import CourseSelector from './components/course-selector';
import Course from './components/course';
import currentMarkdownReducer, { INITIAL_STATE } from './reducers/current-markdown-reducer';
import useCourseReducer from './reducers/course-reducer';
import { CurrentMarkdownDispatchContext } from './contexts/current-markdown';
import { CourseSettersContext, CourseStateContext } from './contexts/current-course';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';
import remarkCallout from './remark-plugins/remark-callout-plugin';
import remarkFixUrls from './remark-plugins/remark-fix-urls-plugin';
import './remark-plugins/remark-callout-plugin.css';
import { ClearMarkdownAction } from './reducers/markdown-actions';

function App() {
  const [courseState, courseSetters] = useCourseReducer();

  const [mdState, dispatchMarkdown] = useReducer(currentMarkdownReducer, INITIAL_STATE);


  const close = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dispatchMarkdown(new ClearMarkdownAction());

    const params = new URLSearchParams(window.location.search);
    params.delete('content-file-uid');
    history?.pushState({}, '', '?' + params.toString());
  }

  return (
    <CurrentMarkdownDispatchContext.Provider value={dispatchMarkdown}>
      <CourseStateContext.Provider value={courseState}>
        <CourseSettersContext.Provider value={courseSetters}>
          <header>
            <h1>Learn Curriculum Viewer</h1>
            <CourseSelector />
          </header>
          <main className='split-screen'>
            { !courseState.loading && courseState.course && <Course courseModel={courseState.course} /> }
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
        </CourseSettersContext.Provider>
      </CourseStateContext.Provider>
    </CurrentMarkdownDispatchContext.Provider>
  )
}

export default App
