import { ContentFileModel } from "./content-file";

export class StandardModel {
  readonly title: string;
  readonly description: string;
  readonly uid: string;
  readonly successCriteria: string[];
  readonly contentFiles: ContentFileModel[];

  constructor(standardData: any, yamlRootUrl: string) {
    this.title = standardData.Title;
    this.description = standardData.Description;
    this.uid = standardData.UID;
    this.successCriteria = standardData.SuccessCriteria;
    this.contentFiles = standardData.ContentFiles?.map(
      (contentFile: any) => new ContentFileModel(contentFile, yamlRootUrl)
    ) || [];
  }
}
