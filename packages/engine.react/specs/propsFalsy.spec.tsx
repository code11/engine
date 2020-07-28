// tslint:disable:no-expression-statement
import React from "react";
import {
  Get,
  Set,
  Ref,
  Merge,
  Prop,
  Arg,
  view,
  producer,
} from "@c11/engine.macro";
import { waitForElement, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Should pass falsy values as well", (done) => {
  const val = "321";
  const defaultState = {
    foo: true,
  };
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Child: view = ({ foo, toggle = Set.foo }) => {
    return (
      <div>
        <div data-testid="foo" data-value={foo}>
          test
        </div>
        <button data-testid="button" onClick={() => toggle(!foo)}></button>
      </div>
    );
  };
  const Parent: view = ({ foo = Get.foo }) => {
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
    expect(x.dataset.value).toBe("true");
    const button = getByTestId(document.body, "button");
    fireEvent.click(button);
    jest.runAllTimers();
    const newFoo = getByTestId(document.body, "foo");
    expect(newFoo.dataset.value).toBe("false");
    done();
  });
});
