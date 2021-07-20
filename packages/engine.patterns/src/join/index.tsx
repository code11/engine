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

export const join = (...args: any[]) => {
  const elements = flattenDeep(args);
  const views = elements.filter((x: unknown) => isView(x));
  const producers = elements.filter((x: unknown) => isProducer(x));
  if (views.length === 0) {
    return;
  } else if (views.length === 1) {
    const view = views[0];
    if (producers.length > 0) {
      view.producers(producers);
    }
    return view;
  } else {
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
  }
};
