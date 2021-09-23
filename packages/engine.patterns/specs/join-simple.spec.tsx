import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { join } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support join() with a single view", async (done) => {
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const A: view = () => <div data-testid="a">a</div>;
  const Component = join(A);
  const app = engine({
    use: [render(<Component />, rootEl)],
  });
  app.start();
  waitFor(() => getByTestId(document.body, "a")).then((x) => {
    expect(x.innerHTML).toBe("a");
    done();
  });
});
