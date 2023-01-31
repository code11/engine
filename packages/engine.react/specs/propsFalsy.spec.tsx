import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
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

// @ts-ignore
beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should pass falsy values as well", async () => {
  const val = "321";
  const defaultState = {
    foo: true,
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Child: view = ({ foo, toggle = update.foo }) => {
    return (
      <div>
        <div data-testid="foo" data-value={foo}>
          test
        </div>
        <button data-testid="button" onClick={() => toggle.set(!foo)}></button>
      </div>
    );
  };
  const Parent: view = ({ foo = observe.foo }) => {
    return <Child foo={foo} />;
  };

  const app = engine({
    state: defaultState,
    use: [render(<Parent />, rootEl)],
  });

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();
  const x = await waitFor(() => getByTestId(document.body, "foo"));
  expect(x.dataset.value).toBe("true");
  const button = getByTestId(document.body, "button");
  await act(async () => {
    fireEvent.click(button);
  });
  jest.runAllTimers();
  await flushPromises();
  const newFoo = getByTestId(document.body, "foo");
  expect(newFoo.dataset.value).toBe("false");
});
