import { StructOperation } from "@c11/engine-types";
import { Identifier, identifier } from "@babel/types";

export const paramsCompiler = (struct: StructOperation): Identifier[] => {
  const value = struct.value;
  let result;
  if (struct.meta && struct.meta.order) {
    result = struct.meta.order.map((x: string) => identifier(x));
  } else {
    throw new Error(
      "Missing arguments order from struct" + JSON.stringify(struct, null, " ")
    );
  }

  return result;
};
