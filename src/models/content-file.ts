export class ContentFileModel {
  readonly type: string;
  readonly uid: string;
  readonly path: string;
  private relativePath: string;
  private markdown: string | null = null;

  constructor(contentFileYaml: any, yamlRootUrl: string) {
    this.type = contentFileYaml.Type;
    this.uid = contentFileYaml.UID;
    this.relativePath = contentFileYaml.Path;
    this.path = yamlRootUrl + this.relativePath;
  }

  async fetchMarkdown(signal?: AbortSignal): Promise<string> {
    if (this.markdown !== null) {
      return this.markdown;
    }

    const res = await fetch(this.path, { signal });
    this.markdown = await res.text();
    return this.markdown;
  }

  async fetchTitle(signal?: AbortSignal): Promise<string> {
    const markdown = await this.fetchMarkdown(signal);

    const trimmedMd = markdown.trimStart();
    if (trimmedMd.startsWith('# ')) {
      const titleEndIdx = trimmedMd.indexOf('\n');
      return markdown.slice(2, titleEndIdx);
    } else {
      return `[No Title] ${this.relativePath}`;
    }
  }
}
