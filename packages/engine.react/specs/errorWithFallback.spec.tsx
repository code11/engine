import { engine } from "@c11/engine.runtime";
import "@testing-library/jest-dom/extend-expect";
import { getByTestId, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { render } from "../src";

const nextTick = process.nextTick;
const flushPromises = () => {
  return new Promise(nextTick);
};

jest.useFakeTimers({
  doNotFake: ["nextTick"],
});

beforeEach(() => {
  document.body.innerHTML = "";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
});

test("should replace the failing component with the provided fallback", async () => {
  console.error = jest.fn();
  const onError = jest.fn(() => <div data-testid="error-fallback"></div>);
  const error = new Error("TEst");
  const Component: view = () => {
    throw error;
  };
  const app = engine({
    use: [
      render(<Component />, "#root", {
        onError,
      }),
    ],
  });
  await act(async () => {
    await app.start();
  });
  jest.runAllTimers();
  await flushPromises();
  await expect(
    waitFor(() => getByTestId(document.body, "error-fallback"))
  ).resolves.toBeDefined();
  await flushPromises();
  jest.runAllTimers();
  expect(onError).toBeCalled();
  expect(onError).toBeCalledWith(error, expect.any(String), undefined);
});
