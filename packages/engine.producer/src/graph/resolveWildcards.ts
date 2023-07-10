import {
  GraphNodeType,
  GraphStructure,
  OperationTypes,
} from "@c11/engine.types";
import { wildcard } from "../wildcard";

export const resolveWildcards = (graph: GraphStructure) => {
  Object.keys(graph)
    .sort((a, b) => {
      // i.e. ensure the wildcards are processed first
      //@ts-ignore
      return graph[a].dependsOn?.length < graph[b].dependsOn?.length ? -1 : 1;
    })
    .forEach((x) => {
      const node = graph[x];
      //@ts-ignore
      if (node.op?.value && node.op.value.value === wildcard) {
        node.isAffectedByWildcards = true;
        node.wildcardsMatched = {};
        //@ts-ignore
      } else if (node.op?.path) {
        //@ts-ignore
        const hasWildcard = node.op.path.find((x) => {
          return x.value === wildcard;
        });
        //@ts-ignore
        const hasWildcardDeps = node.dependsOn.find(
          (x: string) => graph[x]?.isAffectedByWildcards
        );
        if (hasWildcard || hasWildcardDeps) {
          node.isAffectedByWildcards = true;
          node.wildcardsMatched = {};
        }
      }
    });
};
