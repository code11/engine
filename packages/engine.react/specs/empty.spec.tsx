import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should load an empty component", async (done) => {
  const defaultState = {};
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = () => {
    return <div data-testid="foo">foo</div>;
  };
  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe("foo");
    done();
  });
});
