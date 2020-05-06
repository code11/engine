// tslint:disable:no-expression-statement
import React from "react";
import {
  Get,
  Set,
  Ref,
  Merge,
  Prop,
  Arg,
  view,
  producer,
} from "@c11/engine.macro";
import { waitForElement, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";
global.Promise = require('promise');

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Calling engine.getRoot() should return the root element in which the application is mounted", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((foo = Get.foo) => {
    return <div data-testid="foo">{foo}</div>;
  });
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: rootEl,
    },
  });
  jest.runAllTimers();
  expect(engine.getRoot()).toBe(rootEl)
});


test("Should support root as a function", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((foo = Get.foo) => {
    return <div data-testid="foo">{foo}</div>;
  });
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: () => rootEl,
    },
  });
  engine.start();
  jest.runAllTimers();
  expect(engine.getRoot()).toBe(rootEl)
});

test("Should support root as a function that returns a promise", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((foo = Get.foo) => {
    return <div data-testid="foo">{foo}</div>;
  });
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: () => Promise.resolve(rootEl),
    },
  });
  jest.runAllTimers();
  expect(engine.getRoot()).toBe(rootEl)
});

test("Should support root as a promise", () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component = view((foo = Get.foo) => {
    return <div data-testid="foo">{foo}</div>;
  });
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: Promise.resolve(rootEl),
    },
  });
  jest.runAllTimers();
  expect(engine.getRoot()).toBe(rootEl)
});



