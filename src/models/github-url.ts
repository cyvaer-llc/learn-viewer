export class GithubUrl {
  private readonly url: URL;
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
  readonly path: string;

  // Extracts the owner (org) and repo of a github url. Optionally extracts the branch name and path.
  private static GITHUB_PATH_REGEX = /^\/(?<owner>[-\w]+)\/(?<repo>[-\w]+)(\/|\/(blob|tree)\/(?<branch>[-\w]+)\/?(?<path>.*))?$/;
  private static RAW_PATH_REGEX = /^\/(?<owner>[-\w]+)\/(?<repo>[-\w]+)\/(?<branch>[-\w]+)(\/?(?<path>.*))$/;

  constructor(urlStr: string) {
    this.url = new URL(urlStr);

    if (!this.isGithubUrl() && !this.isGithubRawUrl()) {
      throw new Error(`Not a github url: ${this.url.toString()}`);
    }

    const regex = this.isGithubUrl() ? GithubUrl.GITHUB_PATH_REGEX : GithubUrl.RAW_PATH_REGEX;
    const matches = this.url.pathname.match(regex);

    if (matches === null) {
      throw new Error(`Invalid github url: ${this.url.toString()}`);
    }

    this.owner = matches?.groups?.owner || '';
    this.repo = matches?.groups?.repo || '';
    this.branch = matches?.groups?.branch || 'main';
    this.path = matches?.groups?.path || '';
  }

  isGithubUrl(): boolean {
    return this.url.hostname === 'github.com' || this.url.hostname === 'www.github.com';
  }

  isGithubRawUrl(): boolean {
    return this.url.hostname === 'raw.githubusercontent.com';
  }

  courseYamlUrl(): string {
    // If it's the path to a github repo only, make it be a path to the raw course.yaml file.
    // If it's a path to a file, transform into a raw path to that file.

    const url = new URL(this.url.toString());

    const branchRegex = /\/blob\/(.*)\//;
    const branchMatch = url.pathname.match(branchRegex);
    const branchFromUrl = branchMatch ? branchMatch[1] : 'main';

    if (url.pathname.includes('blob/')) {
      url.pathname = url.pathname.replace(/blob\//, '');
    } else {            
      url.pathname = url.pathname.replace(/\/$/, '');
      url.pathname += `/blob/${branchFromUrl}/course.yaml`;
    }

    return url.toString();
  }
}

export const isGithubUrl = (url: string): boolean => {
  const urlobj = new URL(url);
  return urlobj.hostname === 'github.com';
};

export const isGithubRawUrl = (url: string): boolean => {
  const urlobj = new URL(url);
  return urlobj.hostname === 'raw.githubusercontent.com';
};

export const asGithubRawUrl = (url: string, branch: string = 'main'): string => {
  if (!isGithubUrl(url)) throw new Error(`Not a github url: ${url}`);

  const urlobj = new URL(url);
  urlobj.hostname = 'raw.githubusercontent.com';



  const branchRegex = /\/blob\/(.*)\//;
  const branchMatch = urlobj.pathname.match(branchRegex);
  const branchFromUrl = branchMatch ? branchMatch[1] : branch;

  if (urlobj.pathname.includes('/blob/')) {
    urlobj.pathname = urlobj.pathname.replace(/\/blob\//, '');
  }

  return urlobj.toString();
}