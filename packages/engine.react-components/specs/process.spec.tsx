import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { process, State, Process } from "../src";
import { engine } from "@c11/engine.runtime";

const flushPromises = () => {
  return new Promise(setImmediate);
};

jest.useFakeTimers();

// @ts-ignore

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should support component()", async (done) => {
  const fooValue = "123";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);

  type StateA = State<{
    foo: string;
  }>;

  enum StateIds {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
  }

  const A: view = ({
    foo,
    bar = get.bar,
    stateId,
    data = observe.state[prop.stateId],
  }) => {
    expect(foo).toBe(fooValue);
    return <div data-testid="bar">{bar.value()}</div>;
  };
  const B: view = ({ foo, baz = get.baz }) => {
    return <div data-testid="baz">{baz.value()}</div>;
  };
  const p1: producer = ({ foo, bar = update.bar }) => {
    expect(foo).toBe(fooValue);
    bar.set(foo);
  };
  const p2: producer = ({ foo, baz = update.baz }) => {
    baz.set(foo);
  };

  const selector: producer = ({ data, set }) => {
    if (!data.value()) {
      set(State.ONE);
    } else if (data.value("foo")) {
      set(State.TWO);
    } else {
      set(State.THREE);
    }
  };

  const Component = process(
    {
      [State.ONE]: A,
      [State.TWO]: B,
      [State.THREE]: B,
    },
    selector
  );

  const app = engine({
    use: [render(<Component />, rootEl)],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "bar")).then((x) => {
    expect(x.innerHTML).toBe(fooValue);
    waitFor(() => getByTestId(document.body, "baz")).then((x) => {
      expect(x.innerHTML).toBe(fooValue);
      done();
    });
  });
});
