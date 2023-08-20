import yaml from 'js-yaml';
import { StandardModel } from './standard';

export class SectionModel {
  public name: string;
  public repoUrl: string;
  public standards: StandardModel[] | null = null;

  constructor(name: string, repos: string[]) {
    this.name = name;

    // We only need to support one repo per Section right now.
    if (repos.length > 1) {
      throw new Error("Section doesn't support more than one repo.");
    }

    const repoObj: any | undefined = repos?.[0];
    this.repoUrl = repoObj[":Url"] || "";
  }

  async fetchStandardsConfig(signal?: AbortSignal): Promise<StandardModel[]> {
    if (this.standards !== null) {
      return this.standards;
    }

    // The config.yaml will be in the root repo. We want to get the raw text.
    const yamlUrl = this.repoUrl
      .replace("github.com", "raw.githubusercontent.com")
      + '/main/config.yaml';

    const res = await fetch(yamlUrl, { signal });
    const rawStandardsYaml = await res.text();
    const standardsData: any = yaml.load(rawStandardsYaml);

    const standards = standardsData?.Standards.map(
      (standardData: any) => new StandardModel(standardData)
    ) || [];

    this.standards = standards;
    return standards;
  }
}
