import { visit, SKIP, type Visitor, type VisitorResult } from 'unist-util-visit';
import type { Transformer } from 'unified';
import type { Node, Parent } from 'unist';
import type { Root, Heading, Text, List, ListItem, Paragraph } from 'mdast';

export type ChallengeInfo = {
  id: string,
  title: string,
  challengeType: string,
  options?: any,
  answer?: any
};

const visitor: Visitor<Node> = (node: Node, index: number | null, parent: Parent | null): VisitorResult => {
  if (parent === null || index === null) return SKIP;

  if (node.type === 'heading') {
    const headingNode = node as Heading;
    if (isChallengeStart(headingNode)) {
      let closingNodeIdx = index;
      while (!isChallengeEnd(parent.children[closingNodeIdx])) {
        closingNodeIdx++;
      }

      // Extract the children between the challenge start and end nodes, and remove the end node
      const childrenBetween = parent.children.splice(index + 1, closingNodeIdx - index).slice(0, -1);

      // These properties will be provided to whatever React component handles the `section` tag.
      const hProperties: ChallengeInfo = extractInfoNode(childrenBetween);
      const options = extractOptions(childrenBetween);
      const answer = extractAnswer(childrenBetween);
      hProperties.options = options;
      hProperties.answer = answer;

      // The question becomes the new children of the challenge node.
      const question = extractQuestion(childrenBetween);

      const questionNode = {
        type: 'element',
        data: {
          hName: 'div',
        },
        children: question
      };

      let id = 0;
      const makeCheckbox = (option: Node) => {
        const check = {
          type: 'element',
          data: {
            hName: 'input',
            hProperties: {
              tpye: 'checkbox',
              id: `option-${id}`,
              name: `option-${id}`,
            }
          }
        };
        const label = {
          type: 'element',
          data: {
            hName: 'label',
          },
          children: [option]
        };
        const res = {
          type: 'element',
          data: {
            hName: 'div',
          },
          children: [check, label]
        };
        id++;
        return res;
      };

      const optionsRoot = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: 'question-options'
          }
        },
        children: options.map(makeCheckbox)
      };

      const challengeNode = {
        type: 'challenge',
        data: {
          hName: 'section',
          hProperties
        },
        children: [questionNode, optionsRoot]
      };

      // Replace the start node with the challenge node.
      parent.children.splice(index, 1, challengeNode);
      return [SKIP, index + 1];
    }
  }
};

const tagPair = (depth: number, tagName: string) => {
  const isTagStart = (node: Node) => isTag(node, depth, tagName);
  const isTagEnd = (node: Node) => isEndTag(node, depth, tagName);
  return [isTagStart, isTagEnd];
}

const [isChallengeStart, isChallengeEnd] = tagPair(3, 'challenge');
// const [isOptionsStart, isOptionsEnd] = tagPair(5, 'options');
// const [isQuestionStart, isQuestionEnd] = tagPair(5, 'question');
// const [isAnswerStart, isAnswerEnd] = tagPair(5, 'answer');

function isTag(node: Node, depth: number, tagName: string): boolean {
  if (node.type !== 'heading') {
    return false;
  }

  const headingNode = node as Heading;
  // We've encountered some examples where the depth isn't always the same depth. Maybe all that matters is it's a heading?
  //if (headingNode.depth !== depth || headingNode.children?.length !== 1 || headingNode.children?.[0].type !== 'text') {
  if (headingNode.children?.length !== 1 || headingNode.children?.[0].type !== 'text') {
    return false;
  }

  const headingTextNode = headingNode.children[0] as Text;
  return headingTextNode.value.startsWith(`!${tagName}`);
}

function isEndTag(node: Node, depth: number, tagName: string): boolean {
  return isTag(node, depth, `end-${tagName}`);
}

/**
 * Finds the node with the info group, removes it, and returns an object with
 * that info.
 * @param nodes 
 * @returns a ChallengeInfo (id, title, and challengeType)
 */
function extractInfoNode(nodes: Node[]) : ChallengeInfo {
  if (nodes.length < 1 || nodes[0].type !== 'list') {
    throw new Error('First node in a challenge must be a list');
  }

  const infoList = nodes[0] as List;
  nodes.splice(0, 1); // Remove the info list from the nodes

  const infoItems = infoList.children;
  const info = Object.fromEntries(infoItems.map(getKeyValue));
  return info as ChallengeInfo;
}

const extractQuestion = (nodes: Node[]) => extractTag(nodes, 'question');
const extractChallenge = (nodes: Node[]) => extractTag(nodes, 'challenge');
const extractOptions = (nodes: Node[]) => extractTag(nodes, 'options');
const extractAnswer = (nodes: Node[]) => extractTag(nodes, 'answer');

function extractTag(nodes: Node[], tagName: string): Node[] {
  const [isStart, isEnd] = tagPair(-1, tagName);

  const startIdx = nodes.findIndex(isStart);
  if (startIdx === -1) {
    console.log(`No start tag for ${tagName} found`);
    return [];
  }

  const endIdx = nodes.findIndex(isEnd);
  if (endIdx === -1) {
    throw new Error('Could not find end tag');
  }

  if (endIdx < startIdx) {
    throw new Error('End tag found before start tag');
  }

  return nodes.slice(startIdx + 1, endIdx);
}

// function extractList(nodes: Node[]): string[] {
//   if (nodes.length !== 1 ||
//       nodes[0].type !== 'list')
//   {
//     throw new Error('Expected to extract a list');
//   }

//   const list = nodes[0] as List;
//   return list.children.map(getListItemText);
// }

// function extractText(nodes: Node[]): string {
//   if (nodes.length !== 1 ||
//       nodes[0].type !== 'paragraph')
//   {
//     throw new Error('Expected to extract a paragraph with a single text node');
//   }

//   const paragraph = nodes[0] as Paragraph;
//   if (paragraph.children.length !== 1 ||
//       paragraph.children[0].type !== 'text')
//   {
//     throw new Error('Expected to extract a paragraph with a single text node');
//   }
//   return nodes.map(node => node.value).join(''); 
// }

function getListItemText(listItem: ListItem): string {
  // The listItem should have a single paragraph with a single text node
  if (listItem.children.length !== 1 ||
    listItem.children[0].type !== 'paragraph' ||
    listItem.children[0].children.length !== 1 ||
    listItem.children[0].children[0].type !== 'text')
  {
    throw new Error('Challenge info list items should have a single paragraph with a single text node');
  }

  const textNode = listItem.children[0].children[0] as Text;
  const text = textNode.value;
  return text;
}

function getKeyValue(listItem: ListItem): [string, string] {
  // The listItem should have a single paragraph with a single text node
  if (listItem.children.length !== 1 ||
      listItem.children[0].type !== 'paragraph' ||
      listItem.children[0].children.length !== 1 ||
      listItem.children[0].children[0].type !== 'text') {
    throw new Error('Challenge info list items should have a single paragraph with a single text node');
  }

  const textNode = listItem.children[0].children[0] as Text;
  const text = textNode.value;
  const [key, value] = text.split(': ');

  // `type` is in the list, but we're calling it `challengeType` in the info object.
  const adjustedKey = key === 'type' ? 'challengeType' : key;
  return [adjustedKey, value];
}

/**
 * This plugin adds container node with customizable properties in order to produce
 * a container element like callouts and admonitions
 *
 * for example:
 *
 * ### !callout-challenge
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