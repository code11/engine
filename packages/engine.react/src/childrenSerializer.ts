import { isValidElement } from "react";
import { GraphNodeType, ValueSerializer } from "@c11/engine.types";
import { circular } from "./circular";

export const childrenSerializer: ValueSerializer = {
  type: GraphNodeType.EXTERNAL,
  name: "children",
  serializer: (value) => {
    if (
      value instanceof Array &&
      value.find((x: any) => isValidElement(x)) ||
      isValidElement(value)
    ) {
      return JSON.stringify(value, circular());
    }
  },
};
