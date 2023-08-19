import { CourseModel } from '../models/course';

type CourseProps = {
  courseYaml: string
}

export default function Course(props: CourseProps) {
  const { courseYaml } = props;

  const courseModel = new CourseModel(courseYaml);

  return (
    <ul>
      {courseModel.sections.map(section =>
        <li key={section.repoUrl}>
          <a href={section.repoUrl}>{section.name}</a>
        </li>
      )}
    </ul>
  )
}