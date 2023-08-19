import { CourseModel } from '../models/course';
import Section from './section';

type CourseProps = {
  courseYaml: string
}

export default function Course(props: CourseProps) {
  const { courseYaml } = props;

  const courseModel = new CourseModel(courseYaml);

  return (
    <ul>
      {courseModel.sections.map(section =>
        <Section key={section.repoUrl} section={section} />
      )}
    </ul>
  )
}