import { GraphStructure, GraphExternalNode, GraphNodeType } from '.';

export const getExternalNodes = (external: any) => {
  const graph: GraphStructure = Object.keys(external).reduce((acc, x) => {
    const id = `external.${x}`;
    const node: GraphExternalNode = {
      id,
      nesting: x,
      type: GraphNodeType.EXTERNAL,
      value: external[x],
      isDependedBy: []
    };
    acc[id] = node;
    return acc;
  }, {} as GraphStructure);
  return graph;
};
