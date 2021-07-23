const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop);
};

export const isProducer = (x: unknown): boolean => {
  if (
    x &&
    typeof x === "object" &&
    hasOwnProperty(x, "type") &&
    typeof x.type === "string" &&
    x.type === "producer"
  ) {
    return true;
  } else {
    return false;
  }
};
