import { ContentFileModel } from "./content-file";

export class StandardModel {
  readonly title: string;
  readonly description: string;
  readonly uid: string;
  readonly successCriteria: string[];
  readonly contentFiles: ContentFileModel[];
  readonly url: string;

  constructor(standardData: any, yamlRootUrl: string) {
    this.title = standardData.Title;
    this.description = standardData.Description;
    this.uid = standardData.UID;
    this.successCriteria = standardData.SuccessCriteria;
    this.url = yamlRootUrl + '/config.yaml';
    this.contentFiles = standardData.ContentFiles?.map(
      (contentFile: any) => new ContentFileModel(contentFile, yamlRootUrl)
    ) || [];
  }
}
