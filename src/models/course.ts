import yaml from 'js-yaml';
import { SectionModel } from './section';

export class CourseModel {
  readonly sections: SectionModel[]

  constructor(courseYaml: string) {
    const courseData: any = yaml.load(courseYaml);
    if (!courseData) {
      this.sections = []
      return;
    }
    // console.log(JSON.stringify(courseData, null, 2));
    const sectionList = courseData[":Course"];

    this.sections = sectionList.map((section: any) => 
      new SectionModel(section[":Section"], section[":Repos"])
    );
  }
}