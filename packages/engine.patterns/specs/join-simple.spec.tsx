import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
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

test("should support join() with a single view", async () => {
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const A: view = () => <div data-testid="a">a</div>;
  const Component = join(A);
  const app = engine({
    use: [render(<Component />, rootEl)],
  });
  await React.act(async () => {
    return await app.start();
  });
  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "a")).then((x) => {
    expect(x.innerHTML).toBe("a");
  });
});
