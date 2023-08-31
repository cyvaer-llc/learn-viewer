import { type Node } from 'unist';
import { List, ListItem, Paragraph } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { makeMdToHastNode, GeneratedNode } from './generate-node';

const optionId = (challengeId: string, optionNumber: number) => `${challengeId}-option-${optionNumber}`;

/**
 * Takes the list of nodes found between !options tags. Only a single List node is expected.
 * 
 * @param Node[]: optionsBlock 
 * @returns The root node of the options tree, and the list of ids of the checkboxes (the data).
 */
export function extractOptionsNodesAndData(optionsBlock: Node[], challengeId: string): [GeneratedNode, string[], Map<string, string>] {
  // Take a List and get its list items, then turn those into checkboxes.
  const optionsList = getList(optionsBlock);

  // Note the option ID on each of the mdast ListItem nodes
  addOptionIds(optionsList, challengeId);
  
  // The new root will be a div that contains the list of checkboxes. See the example structure described in docs/remark-challenge-plugin.md
  const optionsRoot = makeMdToHastNode('div',
    { className: 'question-options' },
    optionsList.map(makeCheckbox)
  );
  const checkboxIds = optionsList.map(item => item.data!.optionId as string);
  const mdToIdMap = new Map();
  optionsList.forEach(listItem => {
    const id = listItem.data!.optionId;
    const markdown = toMarkdown(listItem);
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

function makeCheckbox(option: Node): GeneratedNode {
  if (option.type !== 'listItem') {
    throw new Error('Each thing that we turn into a checkbox is expected to be a ListItem');
  }

  const id = option.data!.optionId as string;
  const checkbox = makeMdToHastNode('input', {
        type: 'checkbox',
        id: id,
        name: id
      }
  );
  const optionParagraph = unList(option);
  const label = makeMdToHastNode('label', { htmlFor: id }, [optionParagraph]);

  const res = makeMdToHastNode('div', { className: 'tasklist-item' }, [checkbox, label]);
  return res;
};

/**
 * Take something that may be a ListItem and un-list it. That is, return the Paragraph inside it.
 * @param node A node that may be a Paragraph or a ListItem
 * @returns The Paragraph inside the ListItem or the Paragraph, depending on which was passed in.
 */
function unList(node: Node): Paragraph {
  if (node.type === 'paragraph') { return node as Paragraph; }
  if (node.type !== 'listItem') {
    throw new Error('Expected a list or paragraph');
  }

  const listItem = node as ListItem;
  if (listItem.children.length !== 1 && listItem.children[0].type !== 'paragraph') {
    throw new Error('Expected a list with a single paragraph');
  }
  return listItem.children[0] as Paragraph;
}
