import React from "react";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
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

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should propagate changes in props", async () => {
  const val = "321";
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Child: view = ({ foo = prop.foo, setFoo = update.foo }) => {
    return (
      <div>
        <div data-testid="foo">{foo}</div>;
        <div data-testid="set-foo" onClick={() => setFoo.set(val)}></div>
      </div>
    );
  };
  const Parent: view = ({ foo = observe.foo }) => {
    return <Child foo={foo} />;
  };

  const app = engine({
    state: defaultState,
    use: [render(<Parent />, rootEl)],
  });

  await act(async () => {
    return await app.start();
  });

  jest.runAllTimers();
  await flushPromises();

  await waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    expect(x.innerHTML).toBe(defaultState.foo);
    const button = getByTestId(document.body, "set-foo");
    await act(async () => {
      fireEvent.click(button);
    });
    jest.runAllTimers();
    await flushPromises();
    const newFoo = getByTestId(document.body, "foo");
    expect(newFoo.innerHTML).toBe(val);
  });
});
