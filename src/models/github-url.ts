export class GithubUrl {
  private readonly url: URL;
  readonly owner: string;
  readonly repo: string;
  readonly branch: string;
  readonly path: string;

  // Extracts the owner (org) and repo of a github url. Optionally extracts the branch name and path.
  private static GITHUB_PATH_REGEX = /^\/(?<owner>[-\w]+)\/(?<repo>[-\w]+)(\/|\/(blob|tree)\/(?<branch>[-\w]+)\/?(?<path>.*))?$/;
  private static RAW_PATH_REGEX = /^\/(?<owner>[-\w]+)\/(?<repo>[-\w]+)\/(?<branch>[-\w]+)(\/?(?<path>.*))$/;

  private static ROOT_GITHUB = 'https://github.com';
  private static ROOT_RAW = 'https://raw.githubusercontent.com';

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
    if (!this.path.startsWith('/')) {
      this.path = `/${this.path}`;
    }
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

    const url = new URL(GithubUrl.ROOT_RAW);
    const path = this.path.endsWith('course.yaml') ? this.path : this.path.endsWith('/') ? `${this.path}course.yaml` : `${this.path}/course.yaml`;
    url.pathname = `/${this.owner}/${this.repo}/${this.branch}${path}`;
    return url.toString();
  }

  githubUrl(): string {
    const url = new URL(GithubUrl.ROOT_GITHUB);
    url.pathname = `/${this.owner}/${this.repo}/blob/${this.branch}${this.path}`;
    return url.toString();
  }
}