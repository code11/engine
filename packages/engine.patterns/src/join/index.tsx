import React, { ElementType } from "react";
import { isValidElementType } from "react-is";
import {
  extractViews,
  extractProducers,
  isView,
  isProducer,
} from "@c11/engine.utils";
import { View, ViewsList, ProducersList } from "@c11/engine.types";
import flattenDeep from "lodash/flattenDeep";

type ProducersAndViews = ViewsList | ProducersList | ElementType;

export const join = (...args: ProducersAndViews[]) => {
  //@ts-ignore
  const elements = flattenDeep(args);
  const views = extractViews(args);
  const producers = extractProducers(args);
  const components = elements.filter(
    (x: unknown) => !isView(x) && isValidElementType(x)
  ) as ElementType[];

  if (views.length === 0 && components.length === 0 && producers.length === 0) {
    console.error(
      "Component creation failed using join. Please provide at least view, producer or react component"
    );
    return <></>;
  }
  if (views.length === 1 && components.length === 0) {
    const view = views[0];
    if (producers.length > 0) {
      //@ts-ignore
      view.producers(producers);
    }
    return view;
  } else {
    const list: (ElementType | View)[] = [...components, ...views];
    const Component: view = ({ _props }: { _props: unknown }) => {
      return (
        <>
          {list.map((X, i) => (
            <X {..._props} key={i} />
          ))}
        </>
      );
    };
    Component.producers(producers);
    return Component;
  }
};
