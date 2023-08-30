import { Node } from 'unist';
import { List, ListItem, Paragraph } from 'mdast';

type GeneratedNode = {
  type: string,
  data: {
    hName: string,
    hProperties?: any
  },
  children?: (GeneratedNode | Node)[]
}

const optionId = (challengeId: string, optionNumber: number) => `${challengeId}-option-${optionNumber}`;

/**
 * Takes the list of nodes found between !options tags. Only a single List node is expected.
 * 
 * @param Node[]: optionsBlock 
 * @returns The root node of the options tree, and the list of ids of the checkboxes (the data).
 */
export function extractOptionsNodesAndData(optionsBlock: Node[], challengeId: string): [GeneratedNode, string[]] {
  // Take a List and get its list items, then turn those into checkboxes.
  const optionsList = getList(optionsBlock);
  
  const optionsRoot = makeHastNode('div',
    {
      className: 'question-options'
    },
    optionsList.map((item, idx) => makeCheckbox(item, idx, challengeId))
  );
  const checkboxIds = generateCheckboxIds(challengeId, optionsList.length);

  return [optionsRoot, checkboxIds];
}

function getList(nodes: Node[]): ListItem[] {
  if (nodes.length === 0) {
    return [];
  }

  if (nodes.length !== 1 || nodes[0].type !== 'list') {
    throw new Error('Expected a single list');
  }

  const list = nodes[0] as List;
  return list.children;
}

function makeCheckbox(option: Node, idx: number, challengeId: string) {
  if (option.type !== 'listItem') {
    throw new Error('Each thing that we turn into a checkbox is expected to be a ListItem');
  }

  const id = optionId(challengeId, idx);
  const checkbox = makeHastNode('input', {
        type: 'checkbox',
        id: id,
        name: id
      }
  );
  const optionParagraph = unList(option);
  const label = makeHastNode('label', { htmlFor: id }, [optionParagraph]);

  const res = makeHastNode('div', { className: 'tasklist-item' }, [checkbox, label]);
  return res;
};

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

function makeHastNode(tag: string, hProperties: any, children: (GeneratedNode | Node)[] = []): GeneratedNode {
  const res = {
    type: 'element',
    data: {
      hName: tag,
      hProperties
    },
    children
  };
  return res;
}

function generateCheckboxIds(challengeId: string, count: number): string[] {
  return new Array(count).fill(0).map((_, i) => optionId(challengeId, i));
}