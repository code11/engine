import React, { useContext, useEffect, DOMElement } from "react";
import { nanoid } from "nanoid";
import {
  ProducerConfig,
  ProducerInstance,
  RootElement,
  ViewInstance,
} from "@c11/engine.types";
import { path } from '@c11/engine.runtime'
import { component } from "./component";
import { childrenSerializer, context } from "@c11/engine.react";

type ViewOrProducer = ProducerConfig | React.Component;

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
}

const getParentId = (el: HTMLElement | null, root: RootElement) => {
      if (!el || !el.parentElement) {
        return;
      }
      do {
        el = el.parentElement;
      } while (
        el &&
        !(el.dataset?.stateId || el.isSameNode(root))
      );

      return el && el.dataset?.stateId
    }

export function process(states: {
    [k: string]: React.Component | ProducerConfig | ViewOrProducer;
  },
  selector: ProducerConfig) {
    let updatePath: any
    let prevStateId: string
    let parentId: string | undefined | null;
    let updatedParent = false
    let updatedProcess = false

    const ProcessComponent: view = ({
      processId,
      createdAt,
      activeState = observe.process[prop.processId].activeState,
      _get = get,
      _update = update
    }) => {
      updatePath = _update

      if (parentId && !updatedParent) {
        _update(path.states[parentId].childProcesses[processId]).set(createdAt)
        updatedParent = true
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
        })
        updatedProcess =true
      }

      if (prevStateId) {
        _update(path.state[prevStateId]).remove()
      }

      if (!states[activeState]) {
        return
      }

      const State = states[activeState]
      const stateId = nanoid()
      prevStateId = stateId
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
      })
      _update(path.process[processId].activeStateId).set(stateId)
      // TODO: give the state data, setData, etc
      return <div data-state-id={stateId}><State stateId={stateId} processId={processId} /></div>
    }

    ProcessComponent.producers([selector])

    const updateParent = (el) => {
        parentId = getParentId(el, null)
        if (parentId && updatePath) {
          updatePath(path.states[parentId].childProcesses[processId]).set(createdAt)
          updatedParent = true
        }
    }

    // TODO: provide
    return () => {
      const processId = nanoid()
      const createdAt = performance.now()
      return <div ref={updateParent}><ProcessComponent processId={processId} createdAt={createdAt} /></div>
    }
}

