import { GraphNodeType, GraphStructure } from "@c11/engine.types";

export const resolveDependencies = (graph: GraphStructure) => {
  Object.keys(graph).forEach((x) => {
    const node = graph[x];
    if (node.type === GraphNodeType.INTERNAL) {
      node.dependsOn.forEach((y) => {
        const path = y.split(".");
        let found = false;
        let node;
        while (path.length > 0 && !found) {
          let tempPath = path.join(".");
          node = graph[tempPath];
          if (!node) {
            path.pop();
          } else {
            found = true;
          }
        }
        const id = path.join(".");
        if (graph[id]) {
          graph[id].isDependedBy.push(x);
        }
      });
    }
  });
};
