import { GetPath, UpdatePath } from "@c11/engine.types";
import { customAlphabet } from "nanoid";
import { path } from "@c11/engine.runtime";
import { join } from "../join";
import { cleanState } from "./cleanState";
import { getParentId } from "./getParentId";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
  15
);

type ComponentType = {
  componentId: string;
  createdAt: number;
  activeState: string;
  _get: GetPath<any>;
  _update: UpdatePath<any>;
  propsList: any;
  states: any;
};

export const StateManager: view = ({
  states,
  propsList,
  componentId,
  createdAt,
  activeState = observe.components[prop.componentId].activeState,
  _get = get,
  _update = update,
}: ComponentType) => {
  if (!_get(path.components[componentId].id).value()) {
    _update(path.components[componentId]).merge({
      id: componentId,
      createdAt: performance.now(),
      activeState,
      states: Object.keys(states),
      data: {},
      status: {
        isReady: false,
        isTransitioning: false,
      },
    });
  }

  //TODO: Invalid state
  if (!states[activeState]) {
    return;
  }

  //TODO: Add onMounted, onUnmounted listeners to populate the state
  // and used for statuses
  const State = states[activeState]; // join(states[activeState], cleanState);
  const stateId = nanoid();

  _update(path.state[stateId]).set({
    name: activeState,
    parentId: componentId,
    id: stateId,
    createdAt: performance.now(),
    children: {},
    data: {},
    status: {
      isFrozen: false,
      isReady: true,
    },
  });

  _update(path.components[componentId].activeStateId).set(stateId);

  const setParentId = (el: HTMLElement | null) => {
    if (!el) {
      return;
    }
    const parentId = getParentId(el, null);
    if (!parentId) {
      return;
    }
    if (!_get(path.components[componentId].id).value()) {
      return;
    }
    if (_get(path.components[componentId].parentId).value()) {
      return;
    }
    _update(path.components[componentId].parentId).set(parentId);
    _update(path.states[parentId].children[componentId]).set(createdAt);
  };

  //TODO: provide the state with helpers:
  // setData -> updates the internal data of the state
  // transitionState -> makes the state transition to a known next state
  // done/undo -> inform the component that this state is done and can be transitioned to another
  //   in linear states, each state chould have a flag if done - and advancement is then
  //   the transition logic
  // next/back - is an alternative for state transition in linera processes
  // setParentData - sends data to the parent data property

  //TODO: ensure there isn't a conflict between propsList the other "private" information
  //  maybe use an underscore? it would be uncommon for react props to be prefixed with an
  //  underscore
  return (
    <div ref={setParentId} data-state-id={stateId}>
      <State {...propsList} stateId={stateId} componentId={componentId} />
    </div>
  );
};
