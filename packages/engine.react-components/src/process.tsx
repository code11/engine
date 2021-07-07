import React from "react";
import { nanoid } from "nanoid";
import {
  ProducerConfig,
  RootElement,
  GetPath,
  UpdatePath,
} from "@c11/engine.types";
import { path } from "@c11/engine.runtime";

type Timestamp = number;

export type Process = {
  id: string;
  createdAt: Timestamp;
  parentStateId: State["id"] | null;
  states: State["name"][];
  activeState: State["id"] | null;
  data: any;
  status: {
    isReady: boolean;
    isTransitioning: boolean;
  };
};

export type State<Data = { [k: string]: any }> = {
  id: string;
  name: string;
  createdAt: Timestamp;
  parentProcessId: Process["id"];
  childProcesses: {
    [k: string]: Timestamp;
  };
  status: {
    isFrozen: boolean;
    isReady: boolean;
  };
  data: Data;
};

const getParentId = (el: HTMLElement | null, root: RootElement) => {
  if (!el || !el.parentElement) {
    return;
  }
  do {
    el = el.parentElement;
  } while (el && !(el.dataset?.stateId || el.isSameNode(root)));

  return el && el.dataset?.stateId;
};

type ProcessComponentType = {
  processId: string;
  createdAt: number;
  activeState: string;
  _get: GetPath<any>;
  _update: UpdatePath<any>;
};

type StateProps = {
  stateId: string;
  processId: string;
};

export function process(
  states: {
    [k: string]: (props: StateProps) => JSX.Element;
  },
  selector: ProducerConfig
) {
  let updatePath: any;
  let prevStateId: string;
  let parentId: string | undefined | null;
  let updatedParent = false;
  let updatedProcess = false;

  const ProcessComponent: view = ({
    processId,
    createdAt,
    activeState = observe.process[prop.processId].activeState,
    _get = get,
    _update = update,
  }: ProcessComponentType) => {
    updatePath = _update;

    if (parentId && !updatedParent) {
      _update(path.states[parentId].childProcesses[processId]).set(createdAt);
      updatedParent = true;
    }

    if (!updatedProcess) {
      _update(path.process[processId]).set({
        id: processId,
        parentStateId: parentId,
        createdAt: performance.now(),
        activeState: _get(path.process[processId].activeState).value(),
        states: Object.keys(states),
        data: {},
        status: {
          isReady: false,
          isTransitioning: false,
        },
      });
      updatedProcess = true;
    }

    if (prevStateId) {
      _update(path.state[prevStateId]).remove();
    }

    if (!states[activeState]) {
      return;
    }

    const State = states[activeState];
    const stateId = nanoid();
    prevStateId = stateId;
    _update(path.state[stateId]).set({
      name: activeState,
      parentProcessId: processId,
      id: stateId,
      createdAt: performance.now(),
      childProcesses: {},
      data: {},
      status: {
        isFrozen: false,
        isReady: true,
      },
    });
    _update(path.process[processId].activeStateId).set(stateId);
    // TODO: give the state data, setData, etc
    return (
      <div data-state-id={stateId}>
        <State stateId={stateId} processId={processId} />
      </div>
    );
  };

  // @ts-ignore
  selector.props.value.foo = {
    type: "VALUE",
    value: {
      type: "CONST",
      value: (value: string) => {
        console.log("a", updatePath);
        setTimeout(() => {
          console.log("r", updatePath);
        }, 1000);
      },
    },
  };
  console.log(JSON.stringify(selector.props, null, " "));
  ProcessComponent.producers([selector]);

  const updateParent = (
    el: HTMLElement | null,
    processId: string,
    createdAt: number
  ) => {
    if (!el) {
      return;
    }
    parentId = getParentId(el, null);
    if (parentId && updatePath) {
      updatePath(path.states[parentId].childProcesses[processId]).set(
        createdAt
      );
      updatedParent = true;
    }
  };

  return () => {
    const processId = nanoid();
    const createdAt = performance.now();
    return (
      <div
        ref={(el: HTMLElement | null) => updateParent(el, processId, createdAt)}
      >
        <ProcessComponent processId={processId} createdAt={createdAt} />
      </div>
    );
  };
}
