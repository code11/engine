// tslint:disable:no-expression-statement
import React from "react";
import { observe, update, prop, view } from "@c11/engine.macro";
import { waitForElement, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should not clone children", (done) => {
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
  const engine = new Engine({
    state: {
      initial: defaultState,
    },
    view: {
      element: <Parent />,
      root: rootEl,
    },
  });
  jest.runAllTimers();
  waitForElement(() => getByTestId(document.body, "foo")).then((x) => {
    const button = getByTestId(document.body, "change-baz");
    fireEvent.click(button);
    jest.runAllTimers();
    expect(refs[0]).toBe(refs[refs.length - 1]);
    done();
  });
});
