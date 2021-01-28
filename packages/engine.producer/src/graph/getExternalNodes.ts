import {
  GraphStructure,
  GraphExternalNode,
  GraphNodeType,
} from "@c11/engine.types";

export const getExternalNodes = (internalNodes: GraphStructure, props: any) => {
  const externalNodes = Object.entries(internalNodes).reduce(
    (acc, [key, value]) => {
      if (value.type === GraphNodeType.INTERNAL && value.dependsOn) {
        const external = value.dependsOn
          .filter((x) => x.indexOf("external.") === 0)
          .map((x) => {
            const parts = x.split(".");
            return `${parts[0]}.${parts[1]}`;
          });
        external.forEach((x) => {
          if (!acc[x]) {
            const parts = x.split(".");
            const name = parts[1];
            const node: GraphExternalNode = {
              id: x,
              nesting: name,
              nestingPath: [name],
              type: GraphNodeType.EXTERNAL,
              value: props[name],
              isDependedBy: [],
            };
            acc[x] = node;
          }
        });
      }
      return acc;
    },
    {} as any
  );
  return externalNodes;
};
