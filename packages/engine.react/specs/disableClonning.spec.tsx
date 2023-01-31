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

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should not clone children", async () => {
  const val = "321";
  const defaultState = {
    baz: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  let refs = [];
  const Child: view = ({ foo = prop.children }) => {
    refs.push(foo);
    return <div>{foo}</div>;
  };
  const Parent: view = ({ changeBaz = update.baz, baz = observe.baz }) => {
    return (
      <div>
        <button data-testid="change-baz" onClick={() => changeBaz.set(val)} />
        <Child>
          <div data-testid="foo">123</div>
        </Child>
      </div>
    );
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
    const button = getByTestId(document.body, "change-baz");
    await act(async () => {
      fireEvent.click(button);
    });
    jest.runAllTimers();
    expect(refs[0]).toBe(refs[refs.length - 1]);
  });
});
