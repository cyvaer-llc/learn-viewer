import { useReducer } from 'react';
import './assets/link-external-16.svg';
import './App.css';
import CourseSelector from './components/course-selector';
import Course from './components/course';
import Document from './components/document';
import currentMarkdownReducer, { INITIAL_STATE } from './reducers/current-markdown-reducer';
import useCourseReducer from './reducers/course-reducer';
import { CurrentMarkdownDispatchProvider, CurrentMarkdownStateProvider } from './contexts/current-markdown';
import { CourseSettersProvider, CourseStateProvider } from './contexts/current-course';

export default function App() {
  const [courseState, courseSetters] = useCourseReducer();
  const [mdState, dispatchMarkdown] = useReducer(currentMarkdownReducer, INITIAL_STATE);

  return (
    <CurrentMarkdownDispatchProvider value={dispatchMarkdown}>
      <CourseSettersProvider value={courseSetters}>
        <CurrentMarkdownStateProvider value={mdState}>
          <CourseStateProvider value={courseState}>
            <header className='dark-bg'>
              <h1>Learn Curriculum Viewer</h1>
              <CourseSelector />
            </header>
            <main className='split-screen'>
              <Course />
              <Document />
            </main>
            <footer className='dark-bg'>
              <nav className='link-section'>
                <span>&copy;2023 Cyvaer</span>
                <span>
                  <a href='https://github.com/cyvaer-llc/learn-viewer/issues/new/choose' target='_blank' rel='noreferrer'>
                    Report an issue
                  </a>
                </span>
              </nav>
            </footer>
          </CourseStateProvider>
        </CurrentMarkdownStateProvider>
      </CourseSettersProvider>
    </CurrentMarkdownDispatchProvider>
  )
}

