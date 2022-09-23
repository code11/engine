import React, { useEffect } from "react";
import { waitFor, getByTestId, getByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine } from "@c11/engine.runtime";

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
