export type MarkdownPayload = {
  currentMarkdown: string;
  markdownRootUrl: string;
}

export type MarkdownAction = {
  readonly type: string;
  readonly payload: MarkdownPayload;
}

export class SetMarkdownAction {
  static TYPE = 'set-markdown';
  readonly type = SetMarkdownAction.TYPE;
  readonly payload: MarkdownPayload;

  constructor(markdown: string, markdownRootUrl: string) {
    this.payload = {
      currentMarkdown: markdown,
      markdownRootUrl
    };
  }
}

export class ClearMarkdownAction {
  static TYPE = 'clear-markdown';
  readonly type = ClearMarkdownAction.TYPE;
  readonly payload: MarkdownPayload = {
    currentMarkdown: "",
    markdownRootUrl: ""
  };
}