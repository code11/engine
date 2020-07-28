// tslint:disable:no-expression-statement
import React from "react";
import { Observe, Update, Prop, Arg, view, producer } from "@c11/engine.macro";
import { waitForElement, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should propagate changes in props", (done) => {
  const val = "321";
  const defaultState = {
    foo: "123",
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Child: view = ({ foo = Prop.foo, setFoo = Update.foo }) => {
    return (
      <div>
        <div data-testid="foo">{foo}</div>;
        <div data-testid="set-foo" onClick={() => setFoo.set(val)}></div>
      </div>
    );
  };
  const Parent: view = ({ foo = Observe.foo }) => {
    return <Child foo={foo} />;
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
    expect(x.innerHTML).toBe(defaultState.foo);
    const button = getByTestId(document.body, "set-foo");
    fireEvent.click(button);
    jest.runAllTimers();
    const newFoo = getByTestId(document.body, "foo");
    expect(newFoo.innerHTML).toBe(val);
    done();
  });
});
