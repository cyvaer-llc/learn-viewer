import { ClearMarkdownAction, SetMarkdownAction, type MarkdownPayload, type MarkdownAction } from "./markdown-actions";

export const INITIAL_STATE: MarkdownPayload = {
  currentMarkdown: "",
  markdownRootUrl: "",
};

export default function currentMarkdownReducer(state: typeof INITIAL_STATE, action: MarkdownAction): typeof INITIAL_STATE  {
  switch(action.type) {
    case SetMarkdownAction.TYPE:
    case ClearMarkdownAction.TYPE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}