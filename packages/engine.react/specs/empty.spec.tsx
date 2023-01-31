import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";
import { act } from "react-dom/test-utils";

const nextTick = process.nextTick;
const flushPromises = () => {
  return new Promise(nextTick);
};

jest.useFakeTimers({
  doNotFake: ["nextTick"],
});

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should load an empty component", async () => {
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

  await act(async () => {
    await app.start();
  });

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe("foo");
  });
});
