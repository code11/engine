import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine, producers, path } from "@c11/engine.runtime";

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

test("should support path operations", async () => {
  const defaultState = {
    items: {
      foo: {
        bar: {
          value: "123",
        },
      },
    },
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const path1 = path.items.foo;
  const path2 = path.bar;
  const Component: view = ({
    path2,
    value = observe[path1][prop.path2].value,
  }) => {
    return <div data-testid="foo">{value}</div>;
  };

  const app = engine({
    state: defaultState,
    use: [render(<Component path2={path2} />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    expect(x.innerHTML).toBe(defaultState.items.foo.bar.value);
  });
});
