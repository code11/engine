import { InvokablePath, RefiningValue, ValueTypes } from "@c11/engine.types";

export const getRefinee = (
  path: InvokablePath
): RefiningValue["value"] | undefined => {
  if (!path) {
    return;
  }

  const refinee: RefiningValue = path.find(
    (x) => x && x.type === ValueTypes.REFINEE
  ) as RefiningValue;
  if (!refinee) {
    return;
  }

  return refinee.value;
};
