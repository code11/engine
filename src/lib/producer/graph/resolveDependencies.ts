import { NodeType, GraphStructure } from '.';

export const resolveDependencies = (graph: GraphStructure) => {
  Object.keys(graph).forEach(x => {
    const node = graph[x];
    if (node.type === NodeType.INTERNAL) {
      node.dependsOn.forEach(y => {
        graph[y].isDependedBy.push(x);
      });
    }
  });
};
