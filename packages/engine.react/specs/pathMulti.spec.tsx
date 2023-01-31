import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine, producers, path } from "@c11/engine.runtime";
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

test("should support path operations with multiple components", async () => {
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
  const path1 = path.items.foo.bar;
  const Input: view = ({
    value = get[prop.path].value,
    path2 = update[prop.path].value,
  }) => (
    <input
      data-testid="foo"
      type="text"
      defaultValue={value.value()}
      onChange={(e) => path2.set(e.target.value)}
    />
  );
  const Component: view = ({ path }) => {
    return (
      <div>
        <Input path={path} />
      </div>
    );
  };
  let tempStore;
  const sync: producer = ({ value = observe.items.foo.bar.value }) => {
    tempStore = value;
  };
  const app = engine({
    state: defaultState,
    use: [render(<Component path={path1} />, rootEl), producers([sync])],
  });

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    await act(async () => {
      fireEvent.change(x, { target: { value: "321" } });
    });
    jest.runAllTimers();
    await flushPromises();
    expect(tempStore).toBe("321");
  });
});
