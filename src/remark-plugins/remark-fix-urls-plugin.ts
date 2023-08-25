import { visit, CONTINUE, type Visitor, type VisitorResult } from 'unist-util-visit';
import type { Transformer, Plugin } from 'unified';
import type { Node, Parent } from 'unist';
import type { Root, Image, Link } from 'mdast';

type FixUrlOptions = {
  rootUrl: string;
};

/**
 * This plugin transforms relative URLs to absolute URLs. *
 */
export const plugin: Plugin<[FixUrlOptions?], Root> = (options) => {
  const visitor: Visitor<Node> = (node: Node, index: number | null, parent: Parent | null): VisitorResult => {
    if (!node?.url.startsWith('http')) {
      const withoutFile = options?.rootUrl.slice(0, options?.rootUrl.lastIndexOf('/') + 1);
      console.log(withoutFile, node.url);
      node.url = withoutFile + node.url;
    }
  
    return CONTINUE;
  }

  const transformer: Transformer<Root, Root> = (tree: Root) => {
    visit(tree, node => node.type === 'image' || node.type === 'link', visitor);
  };

  return transformer;
};



export default plugin;