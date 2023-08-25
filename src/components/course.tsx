import { CourseModel } from '../models/course';
import Section from './section';

import './course.css';

type CourseProps = {
  courseModel: CourseModel
}

export default function Course(props: CourseProps) {
  const { courseModel } = props;

  return (
    <nav>
      <ul id="root-course-list">
        {courseModel.sections.map(section =>
          <Section key={section.repoUrl} section={section} />
        )}
      </ul>
    </nav>
  )
}