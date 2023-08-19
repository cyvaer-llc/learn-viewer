import { useState } from 'react';
import './App.css';
import CourseSelector from './components/course-selector';

function App() {
  const [course, setCourse] = useState('https://github.com/Ada-Developers-Academy/core/blob/main/c19/seattle/course.yaml');

  return (
    <>
      <nav>
        <h1>Markdown Loader</h1>
        <CourseSelector course={course} setCourse={setCourse} />
      </nav>
      <main>

      </main>
      <footer>
        &copy;2023 Cyvaer
      </footer>
    </>
  )
}

export default App
