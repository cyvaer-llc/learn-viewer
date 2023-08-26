import { SyntheticEvent, useReducer } from 'react';
import './assets/link-external-16.svg';
import './App.css';
import CourseSelector from './components/course-selector';
import Course from './components/course';
import Document from './components/document';
import currentMarkdownReducer, { INITIAL_STATE } from './reducers/current-markdown-reducer';
import useCourseReducer from './reducers/course-reducer';
import { CurrentMarkdownDispatchContext, CurrentMarkdownStateContext } from './contexts/current-markdown';
import { CourseSettersContext, CourseStateContext } from './contexts/current-course';

export default function App() {
  const [courseState, courseSetters] = useCourseReducer();
  const [mdState, dispatchMarkdown] = useReducer(currentMarkdownReducer, INITIAL_STATE);

  return (
    <CurrentMarkdownDispatchContext.Provider value={dispatchMarkdown}>
      <CourseSettersContext.Provider value={courseSetters}>
        <CurrentMarkdownStateContext.Provider value={mdState}>
          <CourseStateContext.Provider value={courseState}>
            <header>
              <h1>Learn Curriculum Viewer</h1>
              <CourseSelector />
            </header>
            <main className='split-screen'>
              <Course />
              <Document />
            </main>
            <footer>
              &copy;2023 Cyvaer
            </footer>
          </CourseStateContext.Provider>
        </CurrentMarkdownStateContext.Provider>
      </CourseSettersContext.Provider>
    </CurrentMarkdownDispatchContext.Provider>
  )
}

