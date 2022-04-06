import { isValidElement } from "react";
import { GraphNodeType, ValueSerializer } from "@c11/engine.types";
import { circular } from "./circular";

export const childrenSerializer: ValueSerializer = {
  type: GraphNodeType.EXTERNAL,
  name: "children",
  serializer: (value) => {
    if (
      value instanceof Array &&
      value.includes((x: any) => !isValidElement(x))
    ) {
      return;
    } else if (!isValidElement(value)) {
      return;
    }
    const result = JSON.stringify(value, circular());
    return result;
  },
};
