import { CourseModel } from '../models/course';
import Section from './section';

import './course.css';

type CourseProps = {
  courseYaml: string
}

export default function Course(props: CourseProps) {
  const { courseYaml } = props;

  const courseModel = new CourseModel(courseYaml);

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