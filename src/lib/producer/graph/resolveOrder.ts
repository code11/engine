import { GraphStructure, GraphNodeType } from '.';

export const resolveOrder = (graph: GraphStructure): string[] => {
  const order: string[] = Object.keys(graph)
    .filter(x => {
      return graph[x].type === GraphNodeType.INTERNAL;
    })
    .sort((a, b) => {
      if (graph[a].isDependedBy.includes(b)) {
        return -1;
      } else {
        return 1;
      }
    });

  return order;
};
