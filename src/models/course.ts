import yaml from 'js-yaml';

export class SectionModel {
  public name: string;
  public repoUrl: string

  constructor(name: string, repos: string[]) {
    this.name = name;
    
    // We only need to support one repo per Section right now.
    if (repos.length > 1) {
      throw new Error("Section doesn't support more than one repo.");
    }

    const repoObj: any | undefined = repos?.[0];
    this.repoUrl = repoObj[":Url"] || "";
  }
}

export class CourseModel {
  public sections: SectionModel[]

  constructor(courseYaml: string) {
    const courseData: any = yaml.load(courseYaml);
    if (!courseData) {
      this.sections = []
      return;
    }
    console.log(JSON.stringify(courseData, null, 2));
    const sectionList = courseData[":Course"];

    this.sections = sectionList.map((section: any) => 
      new SectionModel(section[":Section"], section[":Repos"])
    );
  }
}