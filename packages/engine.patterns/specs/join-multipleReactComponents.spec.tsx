import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { join } from "../src";
import { engine } from "@c11/engine.runtime";

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

test("should support join() with multiple react components", async () => {
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
  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "a")).then(async (x) => {
    expect(x.innerHTML).toBe("123");
    await waitFor(() => getByTestId(document.body, "b")).then((x) => {
      expect(x.innerHTML).toBe("123");
    });
  });
});
