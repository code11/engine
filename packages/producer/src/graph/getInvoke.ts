import { Operation, OperationTypes, ValueTypes } from "@c11/engine-types";

export const getInvoke = (op: Operation) => {
  const invoke: string[] = [];

  if (
    op.type === OperationTypes.MERGE ||
    op.type === OperationTypes.SET ||
    op.type === OperationTypes.REF
  ) {
    op.path.forEach(x => {
      if (x.type === ValueTypes.INVOKE) {
        invoke.push(x.name);
      }
    });
  }

  return invoke;
};
