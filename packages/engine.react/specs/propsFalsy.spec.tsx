import React from "react";
import { observe, update, view } from "@c11/engine.macro";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should pass falsy values as well", async (done) => {
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
  engine({
    state: defaultState,
    use: [renderReact(<Parent />, rootEl)],
  }).start();
  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    expect(x.dataset.value).toBe("true");
    const button = getByTestId(document.body, "button");
    fireEvent.click(button);
    jest.runAllTimers();
    await flushPromises();
    const newFoo = getByTestId(document.body, "foo");
    expect(newFoo.dataset.value).toBe("false");
    done();
  });
});
