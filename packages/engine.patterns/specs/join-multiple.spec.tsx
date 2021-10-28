import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { join } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setTimeout);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support join() with multiple views and producers", (done) => {
  const fooValue = "123";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const A: view = ({ foo, bar = get.bar }) => {
    expect(foo).toBe(fooValue);
    return <div data-testid="bar">{bar.value()}</div>;
  };
  const B: view = ({ foo, baz = get.baz }) => {
    return <div data-testid="baz">{baz.value()}</div>;
  };
  const p1: producer = ({ foo, bar = update.bar }) => {
    expect(foo).toBe(fooValue);
    bar.set(foo);
  };
  const p2: producer = ({ foo, baz = update.baz }) => {
    baz.set(foo);
  };

  const Component = join(A, B, p1, p2);

  const app = engine({
    use: [render(<Component foo={fooValue} />, rootEl)],
  });

  app.start();

  flushPromises();
  jest.runAllTimers();
  flushPromises();
  waitFor(() => getByTestId(document.body, "bar")).then((x) => {
    expect(x.innerHTML).toBe(fooValue);
    waitFor(() => getByTestId(document.body, "baz")).then((x) => {
      expect(x.innerHTML).toBe(fooValue);
      done();
    });
  });
});
