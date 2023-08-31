import { visit, SKIP, type Visitor, type VisitorResult } from 'unist-util-visit';
import { toMarkdown } from 'mdast-util-to-markdown';
import type { Transformer } from 'unified';
import type { Node, Parent } from 'unist';
import type { Root, Heading, Text, ListItem } from 'mdast';
import { extractInfoNode, type ChallengeInfo } from './md-to-js-parse';
import { extractOptionsNodesAndData, getList, unList } from './make-option';
import { makeMdToHastNode } from './generate-node';

export type { ChallengeInfo };

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
      const challengeInfo: ChallengeInfo = extractInfoNode(childrenBetween);
      const options = extractOptions(childrenBetween);

      // The question becomes the new children of the challenge node.
      const question = extractQuestion(childrenBetween);
      const [optionsRoot, optionIds, mdToIdMap] = extractOptionsNodesAndData(options, challengeInfo);
      challengeInfo.options = optionIds;

      // Extract answer data (for multiple choice)
      // The issue with getting answers is that they need to be correlated with the options so we can
      // extract the *option IDs* that correspond to the answers. We have to compare the markdown of
      // the answers to the markdown of the options.
      //
      // NOTE:
      // When it comes time to implement `ordering` types, ONLY answers will exist. ALSO, they will
      // be in an ordered list, not an unordered list. So we can't share this parsing logic for every type.
      const answer = extractAnswer(childrenBetween);
      const answerItems: ListItem[] = getList(answer);
      let answerIds: string[] = [];
      try {
        answerIds = answerItems.map(item => {
          const markdown = toMarkdown(unList(item));
          if (!mdToIdMap.has(markdown)) {
            throw new Error(`Could not find an option with markdown: ${markdown}`);
          }
          return mdToIdMap.get(markdown)!;
        });
        challengeInfo.answer = answerIds;
      } catch(err: any) {
        console.error(`Failed to parse the answer for ${challengeInfo.id}. Error: "${err.message}"`);
      }
      

      console.log("Options:", optionIds, "Answer:", answerIds);

      const challengeNode =
        makeMdToHastNode('section', challengeInfo, [
          makeMdToHastNode('div', {}, question),
          optionsRoot
        ]);

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

function isTag(node: Node, _depth: number, tagName: string): boolean {
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



const extractQuestion = (nodes: Node[]) => extractTag(nodes, 'question');
// const extractChallenge = (nodes: Node[]) => extractTag(nodes, 'challenge');
const extractOptions = (nodes: Node[]) => extractTag(nodes, 'options');
const extractAnswer = (nodes: Node[]) => extractTag(nodes, 'answer');

function extractTag(nodes: Node[], tagName: string): Node[] {
  const [isStart, isEnd] = tagPair(-1 /*TODO: don't need this param?*/, tagName);

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

  // Remove the found nodes, leaving the start tag but removing the end,
  // and return the nodes between the start and end tags.
  return nodes.splice(startIdx + 1, endIdx - startIdx).slice(0, -1);
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