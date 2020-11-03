// tslint:disable:no-expression-statement
import React from "react";
import { observe, update, prop, view } from "@c11/engine.macro";
import { waitFor, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderReact } from "../src";
import { engine } from "@c11/engine";

const flushPromises = () => {
  return new Promise(setImmediate);
}

jest.useFakeTimers();

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should not clone children", async (done) => {
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
  engine({
    state:  defaultState,
    use: [renderReact(<Parent />, rootEl)]
  }).start()
  jest.runAllTimers();
  await flushPromises()
  waitFor(() => getByTestId(document.body, "foo")).then((x) => {
    const button = getByTestId(document.body, "change-baz");
    fireEvent.click(button);
    jest.runAllTimers();
    expect(refs[0]).toBe(refs[refs.length - 1]);
    done();
  });
});
