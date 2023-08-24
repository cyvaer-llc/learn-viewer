import React from 'react';
import './course-selector.css';

type CourseSelectorProps = {
  course: string,
  setCourse: (newCourse: string) => void
}

export default function CourseSelector(props: CourseSelectorProps) {
  const { course, setCourse } = props;

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setCourse(evt.target.value);
  }
  
  return (
    <>
      <input id="course-selector" name="course-selector" value={course} onChange={onChange} />
    </>
  )
}