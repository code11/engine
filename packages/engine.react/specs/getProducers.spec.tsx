import React from "react";
import { observe, update, prop, view, producer } from "@c11/engine.macro";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine, producers } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
}

jest.useFakeTimers();

test.skip("Simple load of a react component", async () => {
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
  engine({
    use: [
      renderReact(<Component />, rootEl),
      producers([testProducer])
    ],
    state: defaultState,
  });
  jest.runAllTimers();
  await flushPromises()
  // expect(engine.getProducers().length).toBe(3);
});
