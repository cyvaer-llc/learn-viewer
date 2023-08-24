import { visit, SKIP, type Visitor, type VisitorResult } from 'unist-util-visit';
import type { Transformer } from 'unified';
import type { Node, Parent } from 'unist';
import type { Root, Heading, Text } from 'mdast';

const visitor: Visitor<Node> = (node: Node, index: number | null, parent: Parent | null): VisitorResult => {
  if (parent === null || index === null) return SKIP;

  if (node.type === 'heading') {
    const headingNode = node as Heading;
    if (isCalloutStart(headingNode)) {
      const calloutType = getStartCalloutType(headingNode);
      let closingNodeIdx = index;
      while (!isCalloutEnd(parent.children[closingNodeIdx])) {
        closingNodeIdx++;
      }

      // Extract the children between the start and end nodes, and remove the end node
      const childrenBetween = parent.children.splice(index + 1, closingNodeIdx - index).slice(0, -1);

      // Replace the current node with a new callout node that generates
      // the correct div.
      const calloutNode = {
        type: 'callout',
        data: {
          hName: 'div',
          hProperties: {
            className: `callout ${calloutType}`
          }
        },
        children: childrenBetween
      };

      // Replace the start node with the callout node.
      parent.children.splice(index, 1, calloutNode);
      return [SKIP, index];
    }
  }
};

function isCalloutStart(node: Heading): boolean {
  // The start callout is a depth-3 heading that begins with !callout-
  if (node.type !== 'heading' || node.children?.length === 0 || node.children?.[0].type !== 'text') {
    return false;
  }
  const headingTextNode = node.children?.[0] as Text;
  return headingTextNode.value.startsWith('!callout-');
}

function getStartCalloutType(node: Heading): string {
  if (!isCalloutStart(node)) throw new Error('Node is not a callout start node');

  const headingTextNode = node.children?.[0] as Text;
  return headingTextNode.value.replace('!callout-', '') ?? '';
}

// (
//   this: unknown,
//   node: Node,
//   index?: number | undefined,
//   parent?: Parent | undefined
// ) => boolean | undefined | void
function isCalloutEnd(node: Node): boolean | undefined {
  if (node.type === 'heading') {
    const headingNode = node as Heading;
    return headingNode.depth === 3 &&
      headingNode.children?.[0].type === 'text' &&
      headingNode.children?.[0].value.startsWith('!end-callout');
  }
}

/**
 * This plugin adds container node with customizable properties in order to produce
 * a container element like callouts and admonitions
 *
 * for example:
 *
 * ### !callout-info
 * 
 * ## The Title goes here
 * 
 * Some content with **bold text**
 * 
 * ### !end-callout
 *
 */
export const plugin = () => {
  const transformer: Transformer<Root, Node> = (tree: Root) => {
    visit(tree, 'heading', visitor);
  };

  return transformer;
};



export default plugin;