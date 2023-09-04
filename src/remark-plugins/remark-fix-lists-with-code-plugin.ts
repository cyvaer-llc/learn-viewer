/**
 * A remark plugin that finds code blocks that are poorly formed and correctly nests them into the lists
 * that they are supposed to be in.
 */
import { visit, CONTINUE, type Visitor, type VisitorResult } from 'unist-util-visit';
import { is } from 'unist-util-is';
import type { Transformer, Plugin } from 'unified';
import type { Parent } from 'unist';
import type { Root, Code, List } from 'mdast';

interface FixCodeListOptions {
}

/**
 * This plugin transforms relative URLs to absolute URLs. *
 */
export const plugin: Plugin<[FixCodeListOptions?], Root> = () => {
  const visitor: Visitor<List> = (node: List, index: number | null, parent: Parent | null): VisitorResult => {
    if (parent === null || index === null) return CONTINUE;

    // The list has a list item, but it's empty. See if a code block comes after it as a sibling.
    // If it does, move the code block into the list item.
    if (is(node.children[0], 'listItem') && node.children[0].children.length === 0) {
      const listItem = node.children[0];
      if (is(parent.children[index + 1], 'code')) {
        const code = parent.children[index + 1] as Code;
        listItem.children.push(code);
        parent.children.splice(index + 1, 1);
      }
    }
  
    return CONTINUE;
  };

  const listCoalescingVisitor: Visitor<List> = (node: List, index: number | null, parent: Parent | null): VisitorResult => {
    if (parent === null || index === null) return CONTINUE;

    // While this list is followed by other lists, coalesce them into this list.
    while (is(parent.children[index + 1], 'list')) {
      const nextList = parent.children[index + 1] as List;
      node.children.push(...nextList.children);
      parent.children.splice(index + 1, 1);
    }

    return CONTINUE;
  };

  const transformer: Transformer<Root, Root> = (tree: Root) => {
    visit(tree, 'list', visitor);
    visit(tree, 'list', listCoalescingVisitor);
  };

  return transformer;
};



export default plugin;