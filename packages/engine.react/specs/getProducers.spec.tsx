import React from "react";
import { observe, update, prop, view, producer } from "@c11/engine.macro";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

test("Simple load of a react component", () => {
  const defaultState = {
    foo: "123",
  };
  const testProducer: producer = ({ foo = observe.foo }) => {};

  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };
  const prodA: producer = ({
    propValue = observe[prop.propName],
    setBar = update.bar,
  }) => {
    setBar.set(propValue);
  };

  Component.producers = [prodA];
  const engine = new Engine({
    view: {
      element: <Component />,
      root: rootEl,
    },
    state: {
      initial: defaultState,
    },
    producers: {
      list: [testProducer],
    },
  });
  jest.runAllTimers();
  expect(engine.getProducers().length).toBe(3);
});
