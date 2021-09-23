import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

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
    return <div data-testid="foo">{foo.value()}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe(defaultState.foo);
    done();
  });
});
