import React from "react";
import isFunction from "lodash/isFunction";
import { waitFor, getByTestId } from "@testing-library/react";
import { EventNames } from "@c11/engine.types";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

const extractEvents = (...fn) => {
  return fn.reduce((acc, x) => {
    acc = acc.concat(x.mock.calls.map((x) => x[0].eventName));
    return acc;
  }, []);
};

jest.useFakeTimers("legacy");

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Simple load of a react component", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };

  expect(Component.displayName).not.toBeUndefined();

  const on = jest.fn();
  const app = engine({
    onEvents: on,
    state: defaultState,
    use: [render(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    expect(x.innerHTML).toBe(defaultState.foo);
    app.stop();
    jest.runAllTimers();
    await flushPromises();
    expect(extractEvents(on)).toEqual([
      EventNames.ENGINE_STARTED,
      EventNames.MODULE_MOUNTED,
      EventNames.VIEW_MOUNTED,
      EventNames.PRODUCER_MOUNTED,
      EventNames.PRODUCER_CALLED,
      EventNames.PRODUCER_MOUNTED,
      EventNames.PRODUCER_CALLED,
      EventNames.VIEW_UNMOUNTED,
      EventNames.PRODUCER_UNMOUNTED,
      EventNames.PRODUCER_UNMOUNTED,
      EventNames.MODULE_UNMOUNTED,
      EventNames.ENGINE_STOPPED,
    ]);
    done();
  });
});
