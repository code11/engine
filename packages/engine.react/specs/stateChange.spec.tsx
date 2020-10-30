// tslint:disable:no-expression-statement
import React from "react";
import { observe, update, prop, arg, view, producer } from "@c11/engine.macro";
import { waitForElement, getByTestId, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Engine } from "../src/engine";

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("Simple load of a react component and work with producers", (done) => {
  const defaultState = {};
  const val = "321";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);
  const Component: view = ({ bam = observe.bam, baz = update.baz }) => {
    return (
      <div>
        <div data-testid="foo" onClick={() => baz.set(val)}></div>;
        <div data-testid="bam">{bam}</div>;
      </div>
    );
  };
  const prod: producer = ({ baz = observe.baz, bam = update.bam }) => {
    bam.set(baz);
  };
  const engine = new Engine({
    producers: {
      list: [prod],
    },
    state: {
      initial: defaultState,
    },
    view: {
      element: <Component />,
      root: rootEl,
    },
  });
  jest.runAllTimers();
  waitForElement(() => getByTestId(document.body, "foo")).then((x) => {
    fireEvent.click(x);
    jest.runAllTimers();
    waitForElement(() => getByTestId(document.body, "bam")).then((y) => {
      expect(y.innerHTML).toBe(val);
      done();
    });
  });
});
