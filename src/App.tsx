import { useEffect, useState } from 'react';
import './App.css';
import CourseSelector from './components/course-selector';

function App() {
  const [courseUrl, setCourseUrl] = useState('https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c19/seattle/course.yaml');
  const [courseData, setCourseData] = useState({});
  const [lastError, setLastError] = useState(null);

  const loadCourseData = (courseUrl: string): () => void => {
    const abortController = new AbortController();
    const goFetch = async () => {
      try {
        const res = await fetch(courseUrl, { signal: abortController.signal });
        const data = await res.text();
        setCourseData(data);
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

  return (
    <>
      <nav>
        <h1>Markdown Loader</h1>
        <CourseSelector course={courseUrl} setCourse={onCourseSet} />
        { lastError && <span id="error">Error: {lastError}</span>}
      </nav>
      <main>
        {/* { courseData?.title } */}
      </main>
      <footer>
        &copy;2023 Cyvaer
      </footer>
    </>
  )
}

export default App
