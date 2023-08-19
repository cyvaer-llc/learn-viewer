import yaml from 'js-yaml';

class ContentFileModel {
  public type: string;
  public uid: string;
  public path: string;

  constructor(contentFileYaml: any) {
    this.type = contentFileYaml.Type;
    this.uid = contentFileYaml.UID;
    this.path = contentFileYaml.Path;
  }
}

export class StandardModel {
  public title: string;
  public description: string;
  public uid: string;
  public successCriteria: string[];
  public contentFiles: ContentFileModel[];

  constructor(standardData: any) {
    this.title = standardData.Title;
    this.description = standardData.Description;
    this.uid = standardData.UID;
    this.successCriteria = standardData.SuccessCriteria;
    this.contentFiles = standardData.ContentFiles?.map(
      (contentFile: any) => new ContentFileModel(contentFile)
    ) || [];
  }
}

export class SectionModel {
  public name: string;
  public repoUrl: string;

  constructor(name: string, repos: string[]) {
    this.name = name;

    // We only need to support one repo per Section right now.
    if (repos.length > 1) {
      throw new Error("Section doesn't support more than one repo.");
    }

    const repoObj: any | undefined = repos?.[0];
    this.repoUrl = repoObj[":Url"] || "";
  }

  async fetchStandardsConfig(signal: AbortSignal | undefined): Promise<StandardModel[]> {
    // The config.yaml will be in the root repo. We want to get the raw text.
    const yamlUrl = this.repoUrl
      .replace("github.com", "raw.githubusercontent.com")
      + '/main/config.yaml';

    const res = await fetch(yamlUrl, { signal });
    const rawStandardsYaml = await res.text();
    const standardsData: any = yaml.load(rawStandardsYaml);
    return standardsData?.Standards.map(
      (standardData: any) => new StandardModel(standardData)
    ) || [];
  }
}
