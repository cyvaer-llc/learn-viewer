import { useReducer } from 'react';
import Document from './document';
import { type MarkdownPayload } from "../reducers/markdown-actions";
import currentMarkdownReducer from '../reducers/current-markdown-reducer';
import { CurrentMarkdownDispatchProvider, CurrentMarkdownStateProvider } from '../contexts/current-markdown';

function DocumentTestHarness({ initialMdState }: { initialMdState: MarkdownPayload }) {
  const [mdState, dispatchMarkdown] = useReducer(currentMarkdownReducer, initialMdState);

  return (
    <CurrentMarkdownDispatchProvider value={dispatchMarkdown}>
      <CurrentMarkdownStateProvider value={mdState}>
        <Document />
      </CurrentMarkdownStateProvider>
    </CurrentMarkdownDispatchProvider>
  )
}

describe('Document', () => {
  it('renders a message to select an item when the markdown document is empty', () => {
    // see: https://on.cypress.io/mounting-react
    const mdState: MarkdownPayload = {currentMarkdown: "", markdownRootUrl: ""};
    cy.mount(<DocumentTestHarness initialMdState={ mdState }/>);
    cy.get("#markdown-container").should('contain', 'Please select an item');
  });

  it('renders a simple markdown doc', () => {
    // see: https://on.cypress.io/mounting-react
    const mdState: MarkdownPayload = {currentMarkdown: "# Hello, World!", markdownRootUrl: ""};
    cy.mount(<DocumentTestHarness initialMdState={ mdState }/>);
    cy.get("#markdown-container > h1").should('have.text', 'Hello, World!');
  });
})