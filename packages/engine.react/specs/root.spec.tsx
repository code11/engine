// tslint:disable:no-expression-statement
import React from "react";
import { observe, view } from "@c11/engine.macro";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
}

global.Promise = require("promise");

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
  engine({
    state: defaultState,
    use: [
      renderReact(<Component />, rootEl)
    ]
  });
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
  engine({
    state: defaultState,
    use: [renderReact(<Component />, () => rootEl)]
  }).start();
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
  engine({
    state:  defaultState,
    use: [renderReact(<Component />, Promise.resolve(rootEl))]
  });
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
  engine({
    state: defaultState,
    use: [renderReact(<Component />, Promise.resolve(rootEl))]
  });
  jest.runAllTimers();
  // expect(engine.getRoot()).toBe(rootEl);
});
