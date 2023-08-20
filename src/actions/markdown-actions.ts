export class SetMarkdownAction {
  static TYPE = 'set-markdown';
  readonly type = SetMarkdownAction.TYPE;
  readonly payload;

  constructor(markdown: string) {
    this.payload = markdown;
  }
}

export class ClearMarkdownAction {
  static TYPE = 'clear-markdown';
  readonly type = ClearMarkdownAction.TYPE;
  readonly payload = "";
}