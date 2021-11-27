import { OperationTypes } from "@c11/engine.types";
import { parseOperation } from "../../fns/parseOperation";
import { stringifyPath } from "../../fns";

export const structureDependencies: producer = ({
  data = observe.structure.elements,
  updateDependencies = update.structure.dependencies,
}) => {
  if (!data) {
    return;
  }

  let list = Object.values(data);

  const relations = list.reduce((acc, x) => {
    if (x.params.value) {
      Object.values(x.params.value).map((op) => {
        const opPath = parseOperation(op);
        const opType = opPath[0];

        if (
          opType === OperationTypes.OBSERVE ||
          opType === OperationTypes.GET ||
          opType === OperationTypes.UPDATE
        ) {
          const path = stringifyPath(opPath);
          if (!acc[path]) {
            acc[path] = {};
          }
          if (!acc[path][opType]) {
            acc[path][opType] = [];
          }
          acc[path][opType].push(x.buildId);
        }
      });
    }

    return acc;
  }, {});

  updateDependencies.set(relations);
};
