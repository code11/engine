import React from "react";
import { nanoid } from "nanoid";
import ViewContext from "./context";
import { BaseProps, BaseState } from "./types";
import {
  ProducerFn,
  ViewConfig,
  ViewInstance,
  ProducerConfig,
  ExternalProducerContext,
  StructOperation,
} from "@c11/engine.types";
import type { ProducerInstance } from "@c11/engine.types";
import { RenderComponent } from "./renderComponent";
import type { RenderContext } from "./render";

// TopLevel{
//   ErrorManagement,
//   propsManagement
// }

// MidLevel{
//   ChildSelection,
//   StateManagement,
//   ListenerManagement
// }

/**
 * - Builds up the state
 * - Creates listeners to react to state changes
 * - Gives the state to the renderComponent
 * - Chooses in which view-state/variant the component needs to be in
 * - Mounts and unmounts children states accordingly
 */

/**
 * - Receives props from the outside world.
 * - Creates the state manager (which to be a component
 * to properly handle errors).
 * - Looks over errors that might occur in the state manager
 * and handles them accordingly
 */

interface SampleState {}

export type ViewFn<ExternalProps = {}> = (
  props: any
) => React.ReactElement<ExternalProps> | null;

export type ViewExtra = {
  producers?: ProducerFn[];
};

export type View<ExternalProps = {}> = ViewFn<ExternalProps> & ViewExtra;

type InstanceApi = {
  replaceView: (config: ViewConfig) => void;
  replaceProducers: (producers: ProducerConfig[]) => void;
};

type InstanceCache = {
  [k: string]: {
    producers: ProducerConfig[];
    instances: {
      [k2: string]: InstanceApi;
    };
  };
};

const cache: InstanceCache = {};

// TODO: Create a production and development view - there too many overlaps now

export function view(config: ViewConfig) {
  const sourceId = `${config.meta?.absoluteFilePath}:${config.meta?.name}`;

  if (cache[sourceId]) {
    Object.keys(cache[sourceId].instances).forEach((x) => {
      cache[sourceId].instances[x].replaceView(config);
    });
  } else {
    cache[sourceId] = {
      producers: [],
      instances: {},
    };
  }

  return class ViewComponent extends React.Component<BaseProps, SampleState> {
    static contextType = ViewContext;
    fn: any;
    isComponentMounted: boolean = false;
    viewProps: StructOperation;
    producers: ProducerInstance[] = [];
    isStateReady = false;
    viewProducer: ProducerInstance;
    viewContext: ExternalProducerContext;
    ref: any;
    id: string;
    static producers(newProducers: ProducerConfig[]) {
      Object.keys(cache[sourceId].instances).forEach(function (x) {
        cache[sourceId].instances[x].replaceProducers(newProducers);
      });
      cache[sourceId].producers = newProducers;
    }
    constructor(externalProps: BaseProps, context: RenderContext) {
      super(externalProps, context);
      const viewContext = {
        props: externalProps,
        keepReferences: ["external.children"],
        ...context.config,
      };
      this.viewContext = viewContext;
      this.viewProps = config.props;
      this.ref = React.createRef();
      this.fn = config.fn;
      const viewProducer = {
        props: config.props,
        fn: this.updateData.bind(this),
        meta: config.meta,
      };
      this.id = nanoid();
      this.viewProducer = context.module.addProducer(viewProducer, viewContext);
      cache[sourceId].producers.forEach((x: any) => {
        this.producers.push(context.module.addProducer(x, viewContext));
      });
      this.state = {};
      this.context = context;
    }
    componentDidMount() {
      if (this.context.config.debug && !cache[sourceId].instances[this.id]) {
        cache[sourceId].instances[this.id] = {
          replaceView: (newConfig) => {
            this.fn = newConfig.fn;
            this.viewProducer.unmount();
            const viewProducer = {
              props: newConfig.props,
              fn: this.updateData.bind(this),
              meta: newConfig.meta,
            };
            this.viewProducer = this.context.module.addProducer(
              viewProducer,
              this.viewContext
            );
            this.viewProducer.mount();
          },
          replaceProducers: (newProducers) => {
            this.producers.forEach((x) => x.unmount());
            this.producers = [];
            newProducers.forEach((x) => {
              const producer = this.context.module.addProducer(
                x,
                this.viewContext
              );
              producer.mount();
              this.producers.push(producer);
            });
          },
        };
      }
      this.isComponentMounted = true;
      this.producers.forEach((x) => x.mount());
      this.viewProducer.mount();
    }
    componentWillUnmount() {
      this.isComponentMounted = false;
      delete cache[sourceId].instances[this.id];
      this.producers.forEach((x) => x.unmount());
      this.viewProducer.unmount();
    }
    updateData(data: any) {
      if (!this.isComponentMounted) {
        return;
      }

      this.setState({
        data,
      });

      if (!this.isStateReady) {
        this.isStateReady = true;
      }
    }
    render() {
      // TODO: anyway of knowing if the props changed?
      this.producers.forEach((x) => {
        x.updateExternal(this.props);
      });
      this.viewProducer.updateExternal(this.props);
      if (!this.isStateReady) {
        return null;
      }
      return <RenderComponent ref={this.ref} state={this.state} fn={this.fn} />;
    }
  };
}
