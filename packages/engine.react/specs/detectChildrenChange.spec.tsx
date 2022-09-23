import React from "react";
import {
  waitFor,
  getByTestId,
  fireEvent,
  getNodeText,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "../src";
import { engine, producers } from "@c11/engine.runtime";

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

test("should detect children change", async () => {
  const val = "321";
  const defaultState = {
    baz: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Child: view = ({ children }) => {
    // console.log(children);
    return <div>{children}</div>;
  };
  const Parent: view = ({ baz = observe.baz, trigger = update.trigger }) => {
    return (
      <div>
        <Child>
          <div data-testid="foo">{baz}</div>
        </Child>
        <div
          data-testid="change-baz"
          onClick={() => trigger.set(Math.random())}
        >
          trigger
        </div>
      </div>
    );
  };

  const changer: producer = ({
    trigger = observe.trigger,
    updateBaz = update.baz,
  }) => {
    if (!trigger) {
      return;
    }
    updateBaz.set("321");
  };

  const app = engine({
    state: defaultState,
    use: [render(<Parent />, rootEl), producers([changer])],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  await waitFor(() => getByTestId(document.body, "foo")).then(async (x) => {
    const button = getByTestId(document.body, "change-baz");
    fireEvent.click(button);
    jest.runAllTimers();
    await flushPromises();
    const value = getNodeText(x);
    expect(value).toBe("321");
  });
});
