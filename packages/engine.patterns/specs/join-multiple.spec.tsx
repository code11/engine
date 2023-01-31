import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { join } from "../src";
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

test("should support join() with multiple views and producers", async () => {
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

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "bar")).then(async (x) => {
    expect(x.innerHTML).toBe(fooValue);
    await waitFor(() => getByTestId(document.body, "baz")).then((x) => {
      expect(x.innerHTML).toBe(fooValue);
    });
  });
});
