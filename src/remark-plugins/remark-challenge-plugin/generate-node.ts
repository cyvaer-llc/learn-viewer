import { type Node } from 'unist';
import { u } from 'unist-builder';

export type GeneratedNode = {
  type: string,
  data: {
    hName: string,
    hProperties?: any
  },
  children?: (GeneratedNode | Node)[]
};

export function makeMdToHastNode(tag: string, hProperties: any, children: (GeneratedNode | Node)[] = []): GeneratedNode {
  const data = { hName: tag, hProperties };
  const res = u('element', { data }, children);
  return res;
}
