import { Operation, OperationTypes } from "@c11/engine.types";
import { parseOperation } from "./parseOperation";

export const getFlags = (
  path,
  params: Operation
): { write: boolean; read: boolean } => {
  let result = {
    write: false,
    read: false,
  };
  if (!params || params.type !== OperationTypes.STRUCT) {
    return result;
  }

  return Object.values(params.value).reduce((acc, value) => {
    let currentPath = parseOperation(value);
    currentPath.shift();
    currentPath = currentPath.join(".");
    if (currentPath === path) {
      if (
        value.type === OperationTypes.OBSERVE ||
        value.type === OperationTypes.GET
      ) {
        acc.read = true;
      } else if (value.type === OperationTypes.UPDATE) {
        acc.write = true;
      }
    }
    return acc;
  }, result);
};
