import { OperationTypes } from "@c11/engine.types";

export const operationColors = {
  [OperationTypes.OBSERVE]: "green",
  [OperationTypes.GET]: "teal",
  [OperationTypes.UPDATE]: "purple.600",
};

export const TabsIdx = {
  "0": "Structure",
  "1": "State",
  "2": "Updates",
  "3": "Views",
  "4": "Producers",
  "5": "Stats",
};
