import React from "react";
import flattenDeep from "lodash/flattenDeep";

const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop);
};

const isView = (x: unknown): boolean => {
  return (
    // @ts-ignore
    x && typeof x === "function" && typeof x.isView === "boolean" && x.isView
  );
};

const isProducer = (x: unknown): boolean => {
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

export const component = (...args: any[]) => {
  const elements = flattenDeep(args);
  const views = elements.filter((x: unknown) => isView(x));
  const producers = elements.filter((x: unknown) => isProducer(x));
  const Component: view = (props: unknown) => {
    return (
      <>
        {views.map((X: typeof React.Component, i) => (
          <X {...props} key={i} />
        ))}
      </>
    );
  };

  Component.producers(producers);

  return Component;
};
