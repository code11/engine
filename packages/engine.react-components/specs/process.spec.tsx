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

test("should support process()", async (done) => {
  const fooValue = "123";
  const rootEl = document.createElement("div");
  rootEl.setAttribute("id", "root");
  document.body.appendChild(rootEl);

  enum StateIds {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
  }

  const A: view = ({ stateId, name = observe.state[prop.stateId].name }) => {
    console.log('called view A', stateId)
    return <div data-testid="A">{name}</div>;
  };

  enum StateBIds {
    ONEB = "ONEB",
  }

  const C: view = ({ name = observe.state[prop.stateId].name }) => {
    return <div data-testid="C">{name}</div>;
  };

  const selectorB: producer = ({
    processId,
    state = update.process[prop.processId].activeState,
  }) => {
    state.set(StateBIds.ONEB);
  };
  const ProcessB = process(
    {
      [StateBIds.ONEB]: C,
    },
    selectorB
  );

  const B: view = () => {
    return (
      <div data-testid="B">
        <ProcessB />
      </div>
    );
  };

  let setState;
  const selector: producer = ({
    processId,
    state = update.process[prop.processId].activeState,
  }) => {
    setState = state.set.bind(state);
  };

  const ProcessA = process(
    {
      [StateIds.ONE]: A,
      [StateIds.TWO]: B,
    },
    selector
  );


  const app = engine({
    use: [render(<ProcessA />, rootEl)],
  });

  app.start();
  jest.runAllTimers();
  await flushPromises();
  expect(setState).toBeDefined();
  setState(StateIds.ONE);
  waitFor(() => getByTestId(document.body, "A")).then(async (x) => {
    expect(x.innerHTML).toBe(StateIds.ONE);
    setState(StateIds.TWO);
    waitFor(() => getByTestId(document.body, "B")).then(async (x) => {
      waitFor(() => getByTestId(document.body, "C")).then(async (x) => {
        expect(x.innerHTML).toBe(StateBIds.ONEB);
        done();
      });
    });
  });
});
