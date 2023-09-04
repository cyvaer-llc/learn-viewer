import React, { SyntheticEvent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';
import remarkCallout from '../remark-plugins/remark-callout-plugin';
import remarkChallenges from '../remark-plugins/remark-challenge-plugin';
import remarkFixUrls from '../remark-plugins/remark-fix-urls-plugin';
import remarkFixListsWithCode from '../remark-plugins/remark-fix-lists-with-code-plugin';

import '../remark-plugins/remark-callout-plugin.css';
import { ClearMarkdownAction } from '../reducers/markdown-actions';
import { useChallengeReducer } from '../reducers/challenge-reducer';
import { useCurrentMarkdownDispatch, useCurrentMarkdownState } from '../contexts/current-markdown';
import { ChallengeStateProvider, ChallengeDispatchProvider } from '../contexts/challenge';
import Challenge from './challenges/challenge';
import Checkbox from './challenges/checkbox';

// Since options for a Challenge originate in the parsed data, we need to initialize
// the options for the challenge on component mount. If we don't memoize the Document,
// we'll get a render loop when the options are initialized.
export default function DocumentWithCtx() {
  const [challengeState, challengeMutators, challengeSelectors] = useChallengeReducer();
  return(
    <ChallengeDispatchProvider value={challengeMutators}>
        <ChallengeStateProvider value={[challengeState, challengeSelectors]}>
          <MemoizedDocument />
        </ChallengeStateProvider>
    </ChallengeDispatchProvider>
  );
}

const MemoizedDocument = React.memo(Document);

function Document() {
  const dispatchMarkdown = useCurrentMarkdownDispatch();
  const mdState = useCurrentMarkdownState();

  const close = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    dispatchMarkdown(new ClearMarkdownAction());

    const params = new URLSearchParams(window.location.search);
    params.delete('content-file-uid');
    history?.pushState({}, '', '?' + params.toString());
  }

  if (!mdState?.currentMarkdown) {
    return (
      <div id="markdown-container">
        &larr; Please select an item
      </div>
    );
  }

  return (
    <div id="markdown-container">
      <div className='right-align'>
        <button className='close-btn' onClick={close}>&times;</button>
      </div>
      <ErrorBoundary fallback={<div>The Markdown failed to load</div>}>
        <ReactMarkdown
          remarkPlugins={[
            [remarkFixUrls, { rootUrl: mdState.markdownRootUrl }],
            remarkGfm,
            remarkFixListsWithCode,
            remarkCallout,
            remarkChallenges,
          ]}
          rehypePlugins={[
            rehypeRaw,
            [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }]
          ]}
          components={{
            input({ node, ...props }: any) {
              return props?.type === 'checkbox' ? (
                <Checkbox {...props} />
              ) : (
                <input {...props} />
              )
            },
            section({ node, ...props }: any) {
              // If the section has a `challengeType` property, then use our React component to render it.
              return props?.challengeType ? (
                <Challenge {...props} />
              ) : (
                <section {...props} />
              )
            }
          }}
        >
          {mdState.currentMarkdown}
        </ReactMarkdown>
      </ErrorBoundary>
    </div>
  );
}