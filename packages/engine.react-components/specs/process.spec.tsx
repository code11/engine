import React from "react";
import { waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@c11/engine.react";
import { process, State, Process } from "../src";
import { engine, producers } from "@c11/engine.runtime";

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

  const A: view = ({
    bar,
    stateId,
    name = observe.state[prop.stateId].name,
  }) => {
    expect(bar).toBe("123");
    return <div data-testid="A">{name}</div>;
  };

  enum StateBIds {
    ONEB = "ONEB",
  }

  const C: view = ({ name = observe.state[prop.stateId].name }) => {
    return <div data-testid="C">{name}</div>;
  };

  let _childProcesses2;
  let _processId2;
  const selectorB: producer = ({
    processId,
    childProcesses = get.process[prop.processId],
    state = update.process[prop.processId].activeState,
  }) => {
    _processId2 = processId;
    _childProcesses2 = childProcesses;
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
  let _childProcesses1;
  let _processId1;
  let _processes;
  let _states;
  let _get;
  const selector: producer = ({
    processId,
    processes = get.process,
    states = get.state,
    goo = get,
    childProcesses = get.process[prop.processId],
    state = update.process[prop.processId].activeState,
  }) => {
    _get = goo;
    _processes = processes;
    _processId1 = processId;
    _childProcesses1 = childProcesses;
    _states = states;
    setState = state.set.bind(state);
    setState(StateIds.ONE);
  };

  const ProcessA = process(
    {
      [StateIds.ONE]: A,
      [StateIds.TWO]: B,
    },
    selector
  );

  const WrapperComponent: view = ({ flag = observe.flag }) => {
    if (flag) {
      return <div data-testid="D">D</div>;
    }
    return <ProcessA bar="123" />;
  };

  let _flag;
  const changer: producer = ({ flag = update.flag }) => {
    _flag = flag;
  };

  const app = engine({
    use: [render(<WrapperComponent />, rootEl), producers([changer])],
  });

  app.start();

  jest.runAllTimers();
  await flushPromises();
  waitFor(() => getByTestId(document.body, "A")).then(async (x) => {
    expect(x.innerHTML).toBe(StateIds.ONE);
    setState(StateIds.TWO);
    waitFor(() => getByTestId(document.body, "B")).then(async (x) => {
      waitFor(() => getByTestId(document.body, "C")).then(async (x) => {
        expect(x.innerHTML).toBe(StateBIds.ONEB);
        _flag.set(true);
        waitFor(() => getByTestId(document.body, "D")).then(async (x) => {
          jest.runAllTimers();
          await flushPromises();
          expect(x.innerHTML).toBe("D");
          expect(_processes.value()).toEqual({});
          expect(_states.value()).toEqual({});
          done();
        });
      });
    });
  });
});
