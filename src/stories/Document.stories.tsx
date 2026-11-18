import preview from '../../.storybook/preview';

import { type MarkdownPayload } from "../reducers/markdown-actions";

import { Document } from '../components/document';
import DocumentTestHarness from '../components/document-test-harness';

const meta = preview.meta({
  title: "Components/Document",
  tags: ['autodocs'],
  component: Document,
});

const emptyPayload: MarkdownPayload = {
  currentMarkdown: "",
  markdownRootUrl: ""
};

export const Empty = meta.story({
  render: () => <DocumentTestHarness initialMdState={emptyPayload} />
});

const headingPayload: MarkdownPayload = {
  currentMarkdown: "# Hello, World!",
  markdownRootUrl: ""
}

export const Heading = meta.story({
  render: () => <DocumentTestHarness initialMdState={headingPayload} />
});
