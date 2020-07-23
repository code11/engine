import { Operation, OperationTypes, ValueTypes } from "@c11/engine.types";

export const getDeps = (op: Operation) => {
  let deps: string[] = [];

  if (
    op.type === OperationTypes.VALUE &&
    op.value.type === ValueTypes.INTERNAL
  ) {
    deps.push("internal." + op.value.path.join("."));
  }
  if (
    op.type === OperationTypes.VALUE &&
    op.value.type === ValueTypes.EXTERNAL
  ) {
    deps.push("external." + op.value.path.join("."));
  }

  if (
    op.type === OperationTypes.GET ||
    op.type === OperationTypes.MERGE ||
    op.type === OperationTypes.SET
  ) {
    op.path.forEach((y) => {
      if (y.type === ValueTypes.INTERNAL) {
        deps.push("internal." + y.path.join("."));
      } else if (y.type === ValueTypes.EXTERNAL) {
        deps.push("external." + y.path.join("."));
      }
    });
  }

  if (op.type === OperationTypes.FUNC) {
    op.value.params.forEach((op: Operation) => {
      deps = deps.concat(getDeps(op));
    });
  }
  return deps;
};
