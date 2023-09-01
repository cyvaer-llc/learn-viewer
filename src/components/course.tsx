import Section from './section';

import './course.css';

import { useCourseState } from '../contexts/current-course';

type CourseProps = {
}

export default function Course(_props: CourseProps) {
  const { course: courseModel, loading, error } = useCourseState();

  if (error) {
    return <div id='error'>Error Loading Course: {error}</div>;
  }

  if (loading) {
    return <div id='loading'>Loading...</div>;
  }

  return (
    <nav>
      <ul id="root-course-list">
        {courseModel?.sections.map(section =>
          <Section key={section.repoUrl} section={section} />
        )}
      </ul>
    </nav>
  )
}