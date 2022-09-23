import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
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
});

test("Simple load of a react component", async () => {
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ foo = observe.foo }) => {
    return <div data-testid="foo">{foo}</div>;
  };

  expect(Component.displayName).not.toBeUndefined();

  const app = engine({
    state: defaultState,
    use: [render(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe(defaultState.foo);
  });
});
