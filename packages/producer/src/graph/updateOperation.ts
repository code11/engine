import { DB } from "jsonmvc-datastore";
import {
  GraphStructure,
  OperationTypes,
  MergeOperation,
  SetOperation,
} from "@c11/engine-types";
import { getInvokablePath } from "./getInvokablePath";

export const updateOperation = (
  db: DB,
  structure: GraphStructure,
  op: MergeOperation | SetOperation
) => {
  const opType = op.type === OperationTypes.MERGE ? "merge" : "add";
  const fn = (value: any, params: any) => {
    console.log("called with", value, params);
    const path = getInvokablePath(structure, op, params);
    console.log("resulted paht is", path);
    if (path) {
      const patch = {
        op: opType,
        path,
        value: value,
      };
      db.patch([patch]);
    }
  };
  return fn;
};
