import React, { useEffect } from "react";
import { waitFor, getByTestId, getByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers("legacy");

beforeEach(() => {
  document.body.innerHTML = "";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
});

test("should replace the failing component with the provided fallback", async () => {
  console.error = jest.fn();
  const onError = jest.fn(() => <div data-testid="error-fallback"></div>);
  const error = new Error();
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
  app.start();
  jest.runAllTimers();
  await flushPromises();
  await expect(
    waitFor(() => getByTestId(document.body, "error-fallback"))
  ).resolves.toBeDefined();
  expect(onError).toBeCalledTimes(1);
  expect(onError).toBeCalledWith(error, expect.any(String), undefined);
});

test("should replace the failing component with a default fallback if no fallback is provided", async () => {
  console.error = jest.fn();
  const Component: view = () => {
    throw new Error();
  };
  const app = engine({
    use: [render(<Component />, "#root")],
  });
  app.start();
  jest.runAllTimers();
  await flushPromises();
  await expect(
    waitFor(() => getByTestId(document.body, "error"))
  ).resolves.toBeDefined();
});

test("should display of error when provided error handler throws error ", async () => {
  console.error = jest.fn();
  const onError = jest.fn(() => {
    throw new Error();
  });
  const Component: view = () => {
    throw new Error();
  };
  const app = engine({
    use: [
      render(<Component />, "#root", {
        onError,
      }),
    ],
  });
  app.start();
  jest.runAllTimers();
  await flushPromises();
  await expect(
    waitFor(() => getByTestId(document.body, "error"))
  ).resolves.toBeDefined();
});
