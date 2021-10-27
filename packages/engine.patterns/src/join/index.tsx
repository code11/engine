import React from "react";
import { isValidElementType } from "react-is";
import { isView, isProducer } from "@c11/engine.utils";
import flattenDeep from "lodash/flattenDeep";

export const join = (...args: any[]) => {
  const elements = flattenDeep(args);
  //TODO: Expand any object like structures .e.g import * as producers from './producers
  const views = elements.filter((x: unknown) => isView(x));
  const components = elements.filter(
    (x: unknown) => !isView(x) && isValidElementType(x)
  );
  const producers = elements.filter((x: unknown) => isProducer(x));

  if (views.length === 0 && components.length === 0 && producers.length === 0) {
    throw new Error(
      "Component creation failed using join. Please provide at least view, producer or react component"
    );
  }
  if (views.length === 1 && components.length === 0) {
    const view = views[0];
    if (producers.length > 0) {
      view.producers(producers);
    }
    return view;
  } else {
    const list = views.concat(components);
    const Component: view = ({ _props }: unknown) => {
      return (
        <>
          {list.map((X: typeof React.Component, i) => (
            <X {..._props} key={i} />
          ))}
        </>
      );
    };
    Component.producers(producers);
    return Component;
  }
};
