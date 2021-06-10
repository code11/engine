import React, { DOMElement } from "react";
import { nanoid } from "nanoid";
import {
  ProducerConfig,
  ProducerInstance,
  ViewInstance,
} from "@c11/engine.types";
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
  processId: Process["id"];
  childProcesses: {
    [k: string]: Timestamp;
  };
  status: {
    isFrozen: boolean;
    isReady: boolean;
  };
  data: Data;
};

const StateComponent: view = ({
  states,
  props,
  processId,
  activeState = observe.process[prop.processId].activeState,
}) => {
  // console.log(states, activeState);
  if (!states || !states[activeState]) {
    // console.error("component could not load states");
    return;
  }

  const State = states[activeState];
  const stateId = nanoid();

  const WrapperView: view = ({
    isReady = observe.state[prop.stateId].status.isReady,
  }) => {
    if (!isReady) {
      return;
    }
    return (
      <div data-state-id={stateId}>
        <State {...props} stateId={stateId} processId={processId} />
      </div>
    );
  };

  const onEntry: producer = ({
    _now = performance.now.bind(performance),
    stateId,
    state = update.state[prop.stateId],
    activeStateId = update.process[prop.processId].activeStateId,
  }) => {
    state.set({
      name: activeState,
      processId,
      id: stateId,
      createdAt: _now(),
      childProcesses: {},
      data: {},
      status: {
        isFrozen: false,
        isReady: true,
      },
    });
    activeStateId.set(stateId);
  };

  const onExit: producer = ({ state = update.state[prop.stateId] }) => {
    return () => {
      state.remove();
    };
  };

  const WrapperComponent = component(WrapperView, [onEntry, onExit]);

  return <WrapperComponent {...props} stateId={stateId} />;
};

const ProcessWrapper: view = ({ props, processId, processRef, states }) => {
  return (
    <div data-process-id={processId} ref={processRef}>
      <StateComponent states={states} props={props} processId={processId} />
    </div>
  );
};

export const process = (
  states: {
    [k: string]: React.Component | ProducerConfig | ViewOrProducer;
  },
  selector: ProducerConfig
) => {
  // geneeate an unique id for this state
  // send the id to the current state
  // should receive one from the parent, but how?

  return class ProcessComponent extends React.Component {
    private id: string;
    static contextType = context;
    // declare context: React.ContextType<typeof context>;
    private parentStateId: string | null = null;
    private processRef: React.RefObject<HTMLDivElement>;
    private syncInstance: ProducerInstance | null = null;
    private selector: ProducerInstance | null = null;
    private instance: Process | null;
    private states;
    constructor(props: any) {
      super(props);
      this.processRef = React.createRef();
      this.id = nanoid();
      this.instance = null;
      this.states = states;
      // selector -> set isFrozen together with the activeState change
    }
    componentDidMount() {
      this.setup();
      this.doSelector();
    }
    doSelector() {
      const parentId = this.getParentId();
      const viewContext = {
        props: {
          processId: this.id,
          parentId,
        },
        keepReferences: ["external.children"],
        serializers: [childrenSerializer],
        debug: this.context.debug,
      };
      this.selector = this.context.addProducer(selector, viewContext, {
        viewId: this.id,
        viewSourceId: this.id,
      });
      this.selector.mount();
    }
    setup() {
      const parentId = this.getParentId();
      if (!parentId) {
        return;
      }
      this.instance = {
        id: this.id,
        parentStateId: parentId,
        createdAt: performance.now(),
        activeState: null,
        states: Object.keys(states),
        data: {},
        status: {
          isReady: false,
          isTransitioning: false,
        },
      };
      const fn: producer = ({
        updateProcess = update.process[prop.processId],
        updateParentChild = update.state[prop.parentId].childProcesses[
          prop.processId
        ],
      }) => {
        updateProcess.set(this.instance);
        updateParentChild.set(this.instance?.createdAt);
      };
      const viewContext = {
        props: {
          processId: this.id,
          parentId,
        },
        keepReferences: ["external.children"],
        serializers: [childrenSerializer],
        debug: this.context.debug,
      };

      this.syncInstance = this.context.addProducer(fn, viewContext, {
        viewId: this.id,
        viewSourceId: this.id,
      });

      this.syncInstance.mount();
    }
    componentWillUnmount() {
      this.syncInstance?.unmount();
      this.selector?.unmount();
    }
    getParentId() {
      if (!this.processRef?.current) {
        return;
      }

      if (this.parentStateId) {
        return this.parentStateId;
      }

      let el = this.processRef.current as HTMLElement | null;

      if (!el) {
        return;
      }

      do {
        el = el.parentElement;
      } while (
        el &&
        !(el.dataset?.stateId || el.isSameNode(this.context.getRoot()))
      );

      if (!el?.dataset?.stateId) {
        return;
      }

      this.parentStateId = el.dataset.stateId;
      return this.parentStateId;
    }
    render() {
      return (
        <ProcessWrapper
          states={this.states}
          processId={this.id}
          processRef={this.processRef}
          props={this.props}
        />
      );
    }
  };
};
