import { useReducer } from 'react';
import Document from './document';
import { type MarkdownPayload } from "../reducers/markdown-actions";
import currentMarkdownReducer from '../reducers/current-markdown-reducer';
import { CurrentMarkdownDispatchProvider, CurrentMarkdownStateProvider } from '../contexts/current-markdown';

export default function DocumentTestHarness({ initialMdState }: { initialMdState: MarkdownPayload }) {
  const [mdState, dispatchMarkdown] = useReducer(currentMarkdownReducer, initialMdState);

  return (
    <CurrentMarkdownDispatchProvider value={dispatchMarkdown}>
      <CurrentMarkdownStateProvider value={mdState}>
        <Document />
      </CurrentMarkdownStateProvider>
    </CurrentMarkdownDispatchProvider>
  )
}