import { SetMarkdownAction } from "./markdown-actions";

export const INITIAL_STATE = {
  currentMarkdown: ""
};

export type Action = {
  type: string,
  payload: any // TODO: Try to make this polyvariant with a better-scoped type
};

export default function currentMarkdownReducer(state: typeof INITIAL_STATE, action: Action): typeof INITIAL_STATE  {
  switch(action.type) {
    case SetMarkdownAction.TYPE:
      return { ...state, currentMarkdown: action.payload };
    default:
      return state;
  }
}