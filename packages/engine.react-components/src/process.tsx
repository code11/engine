import React from "react";
import { customAlphabet } from "nanoid";

import {
  ProducerConfig,
  RootElement,
  GetPath,
  UpdatePath,
} from "@c11/engine.types";
import { path } from "@c11/engine.runtime";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
  15
);

type Timestamp = number;

export type Process = {
  id: string;
  createdAt: Timestamp;
  parentId: State["id"] | null;
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
  propsList: any;
};

type StateProps = {
  stateId: string;
  processId: string;
};

const cleanState: producer = ({ data = update.state[prop.stateId] }) => {
  return () => {
    data.remove();
  };
};

const cleanProcess: producer = ({
  processId,
  data = update.process[param.processId],
}) => {
  return () => {
    data.remove({ processId });
  };
};

export function process(
  states: {
    [k: string]: (props: StateProps) => JSX.Element;
  },
  selector: ProducerConfig
) {
  let updatePath: any;
  let prevStateId: string;

  const ProcessComponent: view = ({
    propsList,
    processId,
    createdAt,
    activeState = observe.process[prop.processId].activeState,
    _get = get,
    _update = update,
  }: ProcessComponentType) => {
    updatePath = _update;

    if (!_get(path.process[processId].id).value()) {
      _update(path.process[processId]).merge({
        id: processId,
        createdAt: performance.now(),
        activeState: _get(path.process[processId].activeState).value(),
        states: Object.keys(states),
        data: {},
        status: {
          isReady: false,
          isTransitioning: false,
        },
      });
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

    State.producers([cleanState]);

    _update(path.process[processId].activeStateId).set(stateId);

    const setParentId = (el: HTMLElement | null) => {
      if (!el) {
        return;
      }
      const parentId = getParentId(el, null);
      if (!parentId) {
        return;
      }
      if (!_get(path.process[processId].id).value()) {
        return;
      }
      if (_get(path.process[processId].parentId).value()) {
        return;
      }
      _update(path.process[processId].parentId).set(parentId);
      _update(path.states[parentId].childProcesses[processId]).set(createdAt);
    };

    // TODO: give the state data, setData, etc
    return (
      <div ref={setParentId} data-state-id={stateId}>
        <State {...propsList} stateId={stateId} processId={processId} />
      </div>
    );
  };

  // @ts-ignore

  //   type: "VALUE",
  //   value: {
  //     type: "CONST",
  //     value: (value: string) => {
  //       console.log("a", updatePath);
  //       setTimeout(() => {
  //         console.log("r", updatePath);
  //       }, 1000);
  //     },
  //   },
  // };

  ProcessComponent.producers([selector, cleanProcess]);

  return (props: any) => {
    const processId = nanoid();
    const createdAt = performance.now();

    return (
      <ProcessComponent
        propsList={props}
        processId={processId}
        createdAt={createdAt}
      />
    );
  };
}
