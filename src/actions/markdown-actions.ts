export class SetMarkdownAction {
  static TYPE = 'set-markdown';
  public type = SetMarkdownAction.TYPE;
  public payload;

  constructor(markdown: string) {
    this.payload = markdown;
  }
}