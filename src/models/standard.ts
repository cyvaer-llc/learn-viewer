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
