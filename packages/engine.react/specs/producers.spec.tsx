import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine, producers } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should mount and unmount producers attached to a component", async (done) => {
  const defaultState = {
    foo: "123",
    shouldMountChild: true,
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };
  const prodA: producer = ({
    propValue = observe[prop.propName],
    bar = update.bar,
  }) => {
    bar.set(propValue);
  };
  Component.producers([prodA]);

  const Parent: view = ({ shouldMount = observe.shouldMountChild }) => {
    return <div>{shouldMount && <Component propName="foo"></Component>}</div>;
  };

  let bar;
  const syncBar: producer = ({ value = observe.bar }) => {
    bar = value;
  };
  let mountFn;
  const setMount: producer = ({ value = update.shouldMountChild }) => {
    mountFn = value.set;
  };
  let fooFn;
  const setFoo: producer = ({ value = update.foo }) => {
    fooFn = value.set;
  };

  const app = engine({
    state: defaultState,
    use: [
      renderReact(<Parent />, rootEl),
      producers([syncBar, setMount, setFoo]),
    ],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();

  waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    expect(bar).toBe("123");
    mountFn(false);
    jest.runAllTimers();
    await flushPromises();
    fooFn("321");
    jest.runAllTimers();
    await flushPromises();
    expect(bar).toBe("123");
    done();
  });
});
