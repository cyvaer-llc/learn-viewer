import { SyntheticEvent, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';
import remarkCallout from '../remark-plugins/remark-callout-plugin';
import remarkChallenges from '../remark-plugins/remark-challenge-plugin';
import remarkFixUrls from '../remark-plugins/remark-fix-urls-plugin';

import '../remark-plugins/remark-callout-plugin.css';
import { ClearMarkdownAction } from '../reducers/markdown-actions';
import { CurrentMarkdownDispatchContext, CurrentMarkdownStateContext } from '../contexts/current-markdown';
import Challenge from './challenge';

export default function Document() {
  const dispatchMarkdown = useContext(CurrentMarkdownDispatchContext)!;
  const mdState = useContext(CurrentMarkdownStateContext);

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
      <ErrorBoundary fallback={ <div>The Markdown failed to load</div> }>
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,
            remarkCallout,
            remarkChallenges,
            [remarkFixUrls, { rootUrl: mdState.markdownRootUrl }]
          ]}
          rehypePlugins={[
            rehypeRaw,
            [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }]
          ]}
          components={{
            section({ node, ...props }: any) {
              console.log(props);
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