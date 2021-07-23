import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { join } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support join() with multiple react components", async (done) => {
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const A = ({ value }) => <div data-testid="a">{value}</div>;
  const B = ({ value }) => <div data-testid="b">{value}</div>;
  const Component = join(A, B);
  const app = engine({
    state: {
      foo: 123,
    },
    use: [render(<Component value="123" />, rootEl)],
  });
  app.start();
  waitFor(() => getByTestId(document.body, "a")).then((x) => {
    expect(x.innerHTML).toBe("123");
    waitFor(() => getByTestId(document.body, "b")).then((x) => {
      expect(x.innerHTML).toBe("123");
      done();
    });
  });
});
