import { type Node } from 'unist';
import { List, ListItem, Paragraph, Code, Text } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { makeMdToHastNode, GeneratedNode } from './generate-node';
import { ChallengeInfo } from './md-to-js-parse';

const optionId = (challengeId: string, optionNumber: number) => `${challengeId}-option-${optionNumber}`;

/**
 * Takes the list of nodes found between !options tags. Only a single List node is expected.
 * 
 * @param Node[]: optionsBlock 
 * @returns The root node of the options tree, and the list of ids of the checkboxes (the data).
 */
export function extractOptionsNodesAndData(optionsBlock: Node[], challenge: ChallengeInfo): [GeneratedNode, string[], Map<string, string>] {
  // Take a List and get its list items, then turn those into checkboxes.
  const optionsList = getList(optionsBlock);

  // Note the option ID on each of the mdast ListItem nodes
  addOptionIds(optionsList, challenge.id);
  
  // The new root will be a div that contains the list of checkboxes. See the example structure described in docs/remark-challenge-plugin.md
  const optionsRoot = makeMdToHastNode('div',
    { className: 'question-options' },
    optionsList.map(optionListItem => makeCheckbox(optionListItem, challenge))
  );
  const checkboxIds = optionsList.map(item => item.data!.optionId as string);
  const mdToIdMap = new Map();
  optionsList.forEach(listItem => {
    const id = listItem.data!.optionId;
    const markdown = toMarkdown(unList(listItem));
    mdToIdMap.set(markdown, id);
  });

  return [optionsRoot, checkboxIds, mdToIdMap];
}

export function getList(nodes: Node[]): ListItem[] {
  if (nodes.length === 0) {
    return [];
  }

  if (nodes.length !== 1 || nodes[0].type !== 'list') {
    throw new Error('Expected a single list');
  }

  const list = nodes[0] as List;
  return list.children;
}

function addOptionIds(optionsList: ListItem[], challengeId: string) {
  optionsList.forEach((item, idx) => {
    const id = optionId(challengeId, idx);
    item.data = { ...item.data, optionId: id };
  });
}

function makeCheckbox(option: Node, challenge: ChallengeInfo): GeneratedNode {
  if (option.type !== 'listItem') {
    throw new Error('Each thing that we turn into a checkbox is expected to be a ListItem');
  }

  const { challengeType } = challenge;
  const id = option.data!.optionId as string;

  const res = makeMdToHastNode('div', { className: ['question-options-item', `${challengeType}-item`] }, [
    makeMdToHastNode('input', { type: 'checkbox', id: id, name: id }),
    makeMdToHastNode('label', { htmlFor: id }, [
      unList(option)
    ])
  ]);
  return res;
};

/**
 * Take something that may be a ListItem and un-list it. That is, return the Paragraph inside it.
 * @param node A node that may be a Paragraph or a ListItem
 * @returns The Paragraph inside the ListItem or the Paragraph, depending on which was passed in.
 */
export function unList(node: Node): Paragraph | Code | Text {
  if (node.type === 'paragraph') { return node as Paragraph; }
  if (node.type === 'code') { return node as Code; }
  if (node.type === 'text') { return node as Text; }
  if (node.type !== 'listItem') {
    throw new Error('Expected a list or paragraph/code/text');
  }

  const listItem = node as ListItem;
  if (listItem.children.length !== 1) {
    throw new Error('Expected a list with a single paragraph/code');
  }

  const firstchild = listItem.children[0];
  if (firstchild.type === 'paragraph') { return firstchild as Paragraph; }
  if (firstchild.type === 'code') { return firstchild as Code; }

  throw new Error(`Expected a list with a single paragraph/code, but it had type '${firstchild.type}'`);
}
