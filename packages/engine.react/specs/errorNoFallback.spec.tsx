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
