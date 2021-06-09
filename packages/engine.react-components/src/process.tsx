import React, { DOMElement } from "react";
import { nanoid } from "nanoid";
import { ProducerConfig, ViewInstance } from "@c11/engine.types";
import { component } from "./component";

type ViewOrProducer = ProducerConfig | React.Component;

type Timestamp = number;

export type Process = {
  id: string;
  createdAt: Timestamp;
  parentStateId: State["id"];
  state: {
    [k: string]: State["id"];
  };
  activeState: State["id"];
  data: any;
  status: {
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
    isActive: boolean;
  };
  data: Data;
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
  const processId = nanoid();

  const StateWrapper: view = ({
    props,
    processId,
    activeState = observe.process[prop.processId].activeState,
  }) => {
    if (!states[activeState]) {
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
          <State {...props} stateId={stateId} />
        </div>
      );
    };

    const initializer: producer = ({
      stateId,
      state = update.state[prop.stateId],
    }) => {
      state.set({
        parentProcessId: processId
        stateId,
      });
      // creates the state etc
    };

    const WrapperComponent = component(WrapperView, initializer);

    return Wrapper;
  };

  return class Process extends React.Component {
    private parentProcessId: string | null = null;
    private processId: string;
    private processRef: React.RefObject<HTMLDivElement>;
    constructor(props: any) {
      super(props);
      this.processId = processId;
      this.processRef = React.createRef();
    }
    componentDidMount() {
      let el = this.processRef.current as HTMLElement | null;

      if (!el) {
        return;
      }

      do {
        el = el.parentElement;
      } while (
        el &&
        !(el.dataset?.processId || el.isSameNode(this.context.getRoot()))
      );

      if (!el?.dataset?.processId) {
        return;
      }

      this.parentProcessId = el.dataset.processId;
    }
    render() {
      return (
        <div data-process-id={this.processId} ref={this.processRef}>
          <StateWrapper props={this.props} />
        </div>
      );
    }
  };
};
