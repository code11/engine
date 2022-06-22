import { OperationTypes } from "@c11/engine.types";

export const operationColors = {
  [OperationTypes.OBSERVE]: "green",
  [OperationTypes.GET]: "teal",
  [OperationTypes.UPDATE]: "purple.600",
};

export const TabsIdx = {
  "0": "State",
  "1": "Views",
  "2": "Producers",
  "3": "Stats",
};
