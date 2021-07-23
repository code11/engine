import { GetPath, UpdatePath } from "@c11/engine.types";
import { customAlphabet } from "nanoid";
import { path } from "@c11/engine.runtime";
import { join } from "../join";
import { cleanComponent } from "./cleanComponent";
import { getParentId } from "./getParentId";
const isView = (x: unknown): boolean => {
  return (
    // @ts-ignore
    x && typeof x === "function" && typeof x.isView === "boolean" && x.isView
  );
};
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

export const ComponentManager: view = ({
  states,
  propsList,
  componentId,
  createdAt,
  activeState = observe.components[prop.componentId].activeState,
  _get = get,
  _update = update,
}: ComponentType) => {
  // console.log("componentId", componentId);
  // console.log("Calling component manager");
  // If the component is not initialized
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
    const error = `Cannot transition to active state. "${activeState}" is not in ${Object.keys(
      states
    ).join(",")}`;
    _update(path.components[componentId].error).set(error);
    return;
  }

  //TODO: Add onMounted, onUnmounted listeners to populate the state
  // and used for statuses
  // console.log("calling active state", activeState);
  const State = states[activeState];
  if (isView(State)) {
    State.producers([cleanComponent]);
  }
  // const State = join(states[activeState], cleanComponent);
  const childComponentId = nanoid();

  _update(path.components[childComponentId]).set({
    name: activeState,
    parentId: componentId,
    id: childComponentId,
    createdAt: performance.now(),
    children: {},
    data: {},
    status: {
      isFrozen: false,
      isReady: true,
    },
  });

  _update(path.components[componentId].activeStateId).set(childComponentId);

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
    _update(path.components[parentId].children[componentId]).set(createdAt);
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
  // console.log(childComponentId, componentId);
  return (
    <div ref={setParentId} data-component-id={childComponentId}>
      <State
        {...propsList}
        componentId={childComponentId}
        parentId={componentId}
      />
    </div>
  );
};
