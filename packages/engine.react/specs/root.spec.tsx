import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test.skip("Calling engine.getRoot() should return the root element in which the application is mounted", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [renderReact(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  // expect(engine.getRoot()).toBe(rootEl);
});

test.skip("Should support root as a function", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [renderReact(<Component />, () => rootEl)],
  });

  app.start();

  jest.runAllTimers();
  // expect(engine.getRoot()).toBe(rootEl);
});

test.skip("Should support root as a function that returns a promise", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [renderReact(<Component />, Promise.resolve(rootEl))],
  });

  app.start();

  jest.runAllTimers();
  // expect(engine.getRoot()).toBe(rootEl);
});

test.skip("Should support root as a promise", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [renderReact(<Component />, Promise.resolve(rootEl))],
  });

  app.start();

  jest.runAllTimers();
  // expect(engine.getRoot()).toBe(rootEl);
});
