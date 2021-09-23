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

test("should support join() with a react component with producers", async (done) => {
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const A = () => <div data-testid="a">a</div>;
  let _foo;
  const b: producer = ({ foo = observe.foo }) => {
    _foo = foo;
  };
  const Component = join(A, b);
  const app = engine({
    state: {
      foo: 123,
    },
    use: [render(<Component />, rootEl)],
  });
  app.start();
  waitFor(() => getByTestId(document.body, "a")).then((x) => {
    expect(x.innerHTML).toBe("a");
    expect(_foo).toBe(123);
    done();
  });
});
