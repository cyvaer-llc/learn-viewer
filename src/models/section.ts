import yaml from 'js-yaml';
import { StandardModel } from './standard';

let lastGoodBranchName = 'main';
const branchNamesToTry = ['main', 'master'];

export class SectionModel {
  readonly name: string;
  readonly repoUrl: string;
  private standards: StandardModel[] | null = null;

  constructor(name: string, repos: string[]) {
    this.name = name;

    // We only need to support one repo per Section right now.
    if (repos.length > 1) {
      throw new Error("Section doesn't support more than one repo.");
    }

    const repoObj: any | undefined = repos?.[0];
    this.repoUrl = repoObj[":Url"] || repoObj[":URL"] || "";
  }

  async fetchStandardsConfig(signal?: AbortSignal): Promise<StandardModel[]> {
    if (this.standards !== null) {
      return this.standards;
    }

    // The config.yaml will be in the root of the repo.
    // We want to get the raw text, so we transform the github URL to the raw githubusercontent version.
    const getYamlRootUrl = (branchName: string) => 
      this.repoUrl.replace("github.com", "raw.githubusercontent.com") + '/' + branchName;
    
    const fetchConfig = async (branchName: string) => {
      const yamlRootUrl = getYamlRootUrl(branchName);
      const yamlUrl = yamlRootUrl + '/config.yaml';
      return fetch(yamlUrl, { signal });
    }

    // Retry with each branch name, and save the last known good one.
    let res = await fetchConfig(lastGoodBranchName);
    if (!res?.ok) {
      for (const branchName of branchNamesToTry) {
        if (branchName === lastGoodBranchName) {
          continue;
        }
        res = await fetchConfig(branchName);
        if (res?.ok) {
          lastGoodBranchName = branchName;
          break;
        }
      }
    }

    if (!res?.ok) {
      throw new Error(`Unable to find the config.yaml for ${this.repoUrl || '<no url provided>'}`);
    }

    const rawStandardsYaml = await res.text();
    const standardsData: any = yaml.load(rawStandardsYaml);

    const standards = standardsData?.Standards.map(
      (standardData: any) => new StandardModel(standardData, getYamlRootUrl(lastGoodBranchName))
    ) || [];

    this.standards = standards;
    return standards;
  }
}
