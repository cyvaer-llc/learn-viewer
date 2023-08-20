import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import './App.css';
import CourseSelector from './components/course-selector';
import Course from './components/course';
import currentMarkdownReducer, { INITIAL_STATE } from './actions/current-markdown-reducer';
import { CurrentMarkdownDispatchContext } from './contexts/current-markdown';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ClearMarkdownAction } from './actions/markdown-actions';

function App() {
  const [courseUrl, setCourseUrl] = useState('https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c19/seattle/course.yaml');
  const [courseYaml, setCourseYaml] = useState("");
  const [lastError, setLastError] = useState(null);
  const [mdState, dispatchMarkdown] = useReducer(currentMarkdownReducer, INITIAL_STATE);

  const loadCourseData = (courseUrl: string): () => void => {
    const abortController = new AbortController();
    const goFetch = async () => {
      try {
        const res = await fetch(courseUrl, { signal: abortController.signal });
        const yaml = await res.text();
        setCourseYaml(yaml);
        setLastError(null);
      } catch(err: any) {
        setLastError(err.message)
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
  }, [])

  const onCourseSet = (course: string) => {
    setCourseUrl(course);
    loadCourseData(course);
    setLastError(null);
  }

  const close = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dispatchMarkdown(new ClearMarkdownAction());
  }

  return (
    <CurrentMarkdownDispatchContext.Provider value={dispatchMarkdown}>
      <nav>
        <h1>Ada Curriculum Viewer</h1>
        <CourseSelector course={courseUrl} setCourse={onCourseSet} />
        { lastError && <span id="error">Error: {lastError}</span>}
      </nav>
      <main className='split-screen'>
        <Course courseYaml={courseYaml} />
        <div id="markdown-container">
          { mdState.currentMarkdown && 
            <div className='right-align'>
              <button className='close-btn' onClick={close}>&times;</button>
            </div> }
          { !mdState.currentMarkdown && <>&larr; Please select an item</> }
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
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
