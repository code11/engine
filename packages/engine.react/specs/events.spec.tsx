import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import { EventNames } from "@c11/engine.types";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";
import { act } from "react-dom/test-utils";

const nextTick = process.nextTick;
const flushPromises = () => {
  return new Promise(nextTick);
};

jest.useFakeTimers({
  doNotFake: ["nextTick"],
});

const extractEvents = (...fn) => {
  return fn.reduce((acc, x) => {
    acc = acc.concat(x.mock.calls.map((x) => x[0].eventName));
    return acc;
  }, []);
};

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Simple load of a react component", async () => {
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

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    expect(x.innerHTML).toBe(defaultState.foo);
    await act(async () => {
      await app.stop();
    });
    jest.runAllTimers();
    await flushPromises();
    expect(extractEvents(on)).toEqual([
      EventNames.ENGINE_STARTED,
      EventNames.STATE_UPDATED,
      EventNames.MODULE_MOUNTED,
      EventNames.VIEW_MOUNTED,
      EventNames.PRODUCER_MOUNTED,
      EventNames.PRODUCER_CALLED,
      EventNames.PRODUCER_MOUNTED,
      EventNames.PRODUCER_CALLED,
      EventNames.PATCH_APPLIED,
      EventNames.STATE_UPDATED,
      EventNames.PATCH_APPLIED,
      EventNames.STATE_UPDATED,
      EventNames.VIEW_UNMOUNTED,
      EventNames.PRODUCER_UNMOUNTED,
      EventNames.PATCH_APPLIED,
      EventNames.STATE_UPDATED,
      EventNames.PRODUCER_UNMOUNTED,
      EventNames.MODULE_UNMOUNTED,
      EventNames.ENGINE_STOPPED,
    ]);
  });
});
