/**
 * Challenge markdown stores data and metadata about a challenge directly in the markdown.
 * This file has parsers to turn the markdown into javascript objects.
 */
import { Node  } from 'unist';
import { List, ListItem, Text } from 'mdast';

export type ChallengeInfo = {
  id: string,
  title: string,
  challengeType: string,
  placeholder?: string,
  topics?: string[],
  options?: string[] | string, // remark turns the array into a space-separated string
  answer?: string[] | string, // remark turns the array into a space-separated string
};

/**
 * Finds the node with the info group, removes it, and returns an object with
 * that info.
 * @param nodes 
 * @returns a ChallengeInfo (id, title, and challengeType)
 */
export function extractInfoNode(nodes: Node[]) : ChallengeInfo {
  if (nodes.length < 1 || nodes[0].type !== 'list') {
    throw new Error('First node in a challenge must be a list');
  }

  const infoList = nodes[0] as List;
  nodes.splice(0, 1); // Remove the info list from the nodes

  const infoItems = infoList.children;

  // TODO: Instead of blindly accepting keys & values, make sure that the keys are the expected
  //       keys of a ChallengeInfo object and parse the values as the expected type.
  const info = Object.fromEntries(infoItems.map(getKeyValue));
  return info as ChallengeInfo;
}

function getKeyValue(listItem: ListItem): [string, string | string[]] {
  const text = getListItemText(listItem);
  const [key, value] = text.split(': ');
  let valueReturned: string | string[] = value;

  // Handle known special cases
  if (key === 'topics') {
    const topics = value.split(',').map(topic => topic.trim());
    valueReturned = topics;
  }

  // `type` is in the list, but we're calling it `challengeType` in the info object.
  const adjustedKey = key === 'type' ? 'challengeType' : key;
  return [adjustedKey, valueReturned];
}

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
