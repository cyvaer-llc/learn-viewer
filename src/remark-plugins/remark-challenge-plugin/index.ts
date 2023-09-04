import { visit, SKIP, type Visitor, type VisitorResult } from 'unist-util-visit';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString as mdastToString } from 'mdast-util-to-string';
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

      // The question becomes the new children of the challenge node.
      const question = extractQuestion(childrenBetween);

      const options = extractOptions(childrenBetween);
      const [optionsRoot, optionIds, mdToIdMap] = extractOptionsNodesAndData(options, challengeInfo);
      challengeInfo.options = optionIds;

      const answer = extractAnswer(childrenBetween);
      const answerIds = getAnswerIds(answer, challengeInfo, mdToIdMap);

      console.log("Options:", optionIds, "Answer:", answerIds);

      const placeholder = extractPlaceholder(childrenBetween);
      const placeholderText = mdastToString(placeholder);
      challengeInfo.placeholder = placeholderText;

      console.log(`${challengeInfo.id}: placeholder text: ${challengeInfo.placeholder}`);

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

// Extract answer data (for multiple choice)
// The issue with getting answers is that they need to be correlated with the options so we can
// extract the *option IDs* that correspond to the answers. We have to compare the markdown of
// the answers to the markdown of the options.
//
// NOTE:
// When it comes time to implement `ordering` types, ONLY answers will exist. ALSO, they will
// be in an ordered list, not an unordered list. So we can't share this parsing logic for every type.
function getAnswerIds(answer: Node[], challengeInfo: ChallengeInfo, mdToIdMap: Map<string, string>) {
  if (answer.length === 0) {
    return [];
  }

  const answerItems: ListItem[] = ['multiple-choice', 'checkbox'].includes(challengeInfo.challengeType) ? getList(answer) : [];
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

  return answerIds;
}

const tagPair = (tagName: string) => {
  const isTagStart = (node: Node) => isTag(node, tagName);
  const isTagEnd = (node: Node) => isEndTag(node, tagName);
  return [isTagStart, isTagEnd];
};

const [isChallengeStart, isChallengeEnd] = tagPair('challenge');

/**
 * For Learn markdown, tags are heading elements that have text like !<tagName>
 * @param node The Node you want to check to see if it's a tag
 * @param tagName The name of the tag we're looking for
 * @returns Whether or not node is a tag
 */
function isTag(node: Node, tagName: string): boolean {
  if (node.type !== 'heading') {
    return false;
  }

  const headingNode = node as Heading;
  if (headingNode.children?.length !== 1 || headingNode.children?.[0].type !== 'text') {
    return false;
  }

  const headingTextNode = headingNode.children[0] as Text;
  return headingTextNode.value.startsWith(`!${tagName}`);
}

function isEndTag(node: Node, tagName: string): boolean {
  return isTag(node, `end-${tagName}`);
}

const extractQuestion = (nodes: Node[]) => extractTag(nodes, 'question');
const extractOptions = (nodes: Node[]) => extractTag(nodes, 'options');
const extractAnswer = (nodes: Node[]) => extractTag(nodes, 'answer');
const extractPlaceholder = (nodes: Node[]) => extractTag(nodes, 'placeholder');

function extractTag(nodes: Node[], tagName: string): Node[] {
  const [isStart, isEnd] = tagPair(tagName);

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
 *   ### !challenge
 *   * type: multiple-choice
 *   * id: abc368
 *   * title: Title Describing this question
 *   ##### !question
 *
 *   What is the *answer*? (Pick one)
 *
 *   ##### !end-question
 *   ##### !options
 *
 *   * Option `1`
 *   * Option `2` with _some_ markdown
 *   * Option `3`**!**
 *
 *   ##### !end-options
 *   ##### !answer
 *
 *   * Option `2` with _some_ markdown
 *
 *   ##### !end-answer
 *   ### !end-challenge
 *
 */
export const plugin = () => {
  const transformer: Transformer<Root, Node> = (tree: Root) => {
    visit(tree, 'heading', visitor);
  };

  return transformer;
};



export default plugin;