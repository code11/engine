import { GraphStructure, ExternalNode, NodeType } from '.';

export const getExternalNodes = (external: any) => {
  const graph: GraphStructure = Object.keys(external).reduce((acc, x) => {
    const id = `external.${x}`;
    const node: ExternalNode = {
      id,
      type: NodeType.EXTERNAL,
      value: external[x],
      isDependedBy: []
    };
    acc[id] = node;
    return acc;
  }, {} as GraphStructure);
  return graph;
};
