// tslint:disable:no-expression-statement
import React from "react";
import { get, view } from "@c11/engine.macro";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
}

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Expect to call using only get", async (done) => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = get.foo }) => {
    expect(foo).toBeDefined();
    return <div data-testid="foo">{foo()}</div>;
  };
  engine({
    state: defaultState,
    use: [renderReact(<Component />, rootEl)]
  }).start()
  jest.runAllTimers();
  await flushPromises()
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe(defaultState.foo);
    done();
  });
});
