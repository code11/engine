import React from "react";
import { randomId } from "@c11/engine.utils";
import { EventNames, PathType } from "@c11/engine.types";
import { pathFn } from "@c11/engine.runtime";
import { now, extractProducers } from "@c11/engine.utils";
import {
  ProducersList,
  ViewConfig,
  ProducerConfig,
  ExternalProducerContext,
  StructOperation,
  OperationTypes,
  UpdateValue,
  View,
  ViewFn,
} from "@c11/engine.types";
import type { ProducerInstance } from "@c11/engine.types";
import { RenderComponent } from "./renderComponent";
import type { RenderContext } from "./render";
import ViewContext from "./context";
import { BaseProps } from "./types";
import { getParentId } from "./getParentId";
import { childrenSerializer } from "./childrenSerializer";
import { DefaultError, ErrorBoundary } from "./errorBoundary";

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

interface SampleState {
  error: Error | null;
  data: any;
}

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

export type { View, ViewFn };

// TODO: Create a production and development view - there too many overlaps now
//TODO: Add viewId on every view - see engine.patterns/component implementation
//  storing data on a views[viewId] location might be problematic
//  if the parent will re-render and trigger the re-rendering of the child view
//  which will receive a new viewId - further exploration is needed

//TODO: update the state for the parent to add the child id link
//  update.views[parentId].children[viewId]

//TODO: make the above capability plug&play through a flag or a plugin
//  adding everything on state regarding the lifecycle of the views
//  might add unnecessary overhead.
//  also, for easier development capabilities could be split and added
//  in a bundle
//  example plugins:
//  - view recording: record views on state, allocate a viewId, parentId, etc
//    allow the view hierarchy to be known to the views
//  - view monitoring: add to the view instance on the state information regarding
//    isInViewport, isSelected, isFocused, etc
//  - producer recodring: the same recording as above but for producers and
//    allocate a producerId which can be used with update.producers[prop.producerId].data
export function view(config: ViewConfig) {
  const sourceId = config.sourceId;
  let producers: ProducerConfig[] = [];
  let setProducers: RenderContext["setProducers"];
  return class ViewComponent extends React.Component<BaseProps, SampleState> {
    emit: RenderContext["emit"];
    config: ViewConfig;
    static contextType = ViewContext;
    static displayName = `${config.meta?.relativeFilePath}::${config.meta?.name}:${config.meta?.location?.start.line}`;
    stateUpdate: any = {};
    fn: any;
    isComponentMounted: boolean = false;
    viewProps: StructOperation;
    producers: { [k: string]: ProducerInstance } = {};
    isStateReady = false;
    createdAt: number;
    viewProducer: ProducerInstance;
    viewStateProducer: ProducerInstance;
    viewContext: ExternalProducerContext;
    _update: ((path: any) => UpdateValue<any, any>) | undefined;
    ref: any;
    id: string;
    static producers(newProducers: ProducersList) {
      const producersList = extractProducers(newProducers);
      producers = producers.concat(producersList);
      if (setProducers) {
        setProducers(sourceId, producersList);
      }
    }
    static isView = true;
    static buildId = config.buildId;
    constructor(externalProps: BaseProps, context: RenderContext) {
      super(externalProps, context);

      this.id = randomId();
      this.config = config;
      const emit: RenderContext["emit"] = (
        name,
        payload = {},
        context = {}
      ) => {
        this.context.emit &&
          this.context.emit(name, payload, {
            ...context,
            viewId: this.config.buildId,
            viewInstanceId: this.id,
          });
      };
      this.emit = emit.bind(this);
      const viewContext = {
        emit: this.emit,
        props: {
          ...externalProps,
          _viewId: this.id,
          _props: externalProps,
        },
        keepReferences: ["external.children"],
        serializers: [childrenSerializer],
        debug: context.debug,
      };
      this.viewContext = viewContext;
      this.viewProps = config.props;
      this.ref = React.createRef();
      this.fn = config.fn;
      this.createdAt = now();
      const viewProducer = {
        props: config.props,
        fn: this.updateData.bind(this),
        meta: config.meta,
      };
      const viewStateProducer = {
        props: {
          type: OperationTypes.STRUCT,
          value: {
            _update: {
              type: OperationTypes.CONSTRUCTOR,
              value: PathType.UPDATE,
            },
          },
        },
        fn: ({ _update }: any) => {
          this._update = _update;
          _update(pathFn("views", this.id)).set({
            id: this.id,
            createdAt: this.createdAt,
            data: {},
          });
          return () => {
            _update(pathFn("views", this.id)).remove();
          };
        },
        meta: {
          ...config.meta,
          name: "InternalProducer",
        },
      };
      this.viewProducer = context.addProducer(viewProducer, viewContext, {
        viewId: this.id,
        viewSourceId: sourceId,
      });
      this.viewStateProducer = context.addProducer(
        //@ts-ignore
        viewStateProducer,
        viewContext,
        {
          viewId: this.id,
          viewSourceId: sourceId,
        }
      );
      if (sourceId) {
        const updatedProducers = context.getProducers(sourceId);
        if (updatedProducers) {
          producers = updatedProducers;
        }
        setProducers = context.setProducers;
        context.registerView(sourceId, config);
        if (!updatedProducers) {
          context.setProducers(sourceId, producers);
        }
        context.subscribeViewInstance(sourceId, this.id, {
          replaceView: (newConfig) => {
            this.fn = newConfig.fn;
            this.viewProducer.unmount();
            const viewProducer = {
              props: newConfig.props,
              fn: this.updateData.bind(this),
              meta: newConfig.meta,
            };
            this.viewProducer = this.context.addProducer(
              viewProducer,
              this.viewContext,
              {
                viewId: this.id,
                viewSourceId: sourceId,
              }
            );
            this.viewProducer.mount();
          },
          replaceProducer: (id, config) => {
            if (this.producers[id]) {
              const producer = this.producers[id];
              delete this.producers[id];
              producer.unmount();
            }
            this.producers[id] = this.context.addProducer(
              config,
              this.viewContext,
              {
                viewId: this.id,
                viewSourceId: sourceId,
              }
            );
            if (this.isComponentMounted) {
              this.producers[id].mount();
            }
          },
          replaceProducers: (newProducers) => {
            Object.keys(this.producers).forEach((x) => {
              const producer = this.producers[x];
              delete this.producers[x];
              producer.unmount();
            });
            this.producers = {};
            newProducers.forEach((x) => {
              const producer = this.context.addProducer(x, this.viewContext, {
                viewId: this.id,
                viewSourceId: sourceId,
              });
              if (this.isComponentMounted) {
                producer.mount();
              }
              const producerId = x.sourceId || randomId();
              this.producers[producerId] = producer;
            });
          },
        });
      }
      producers.forEach((x: any) => {
        const id = x.sourceId || randomId();
        this.producers[id] = context.addProducer(x, viewContext, {
          viewId: this.id,
          viewSourceId: sourceId,
        });
      });
      this.state = { data: {}, error: null };
      this.context = context;
    }

    static getDerivedStateFromError(error: Error) {
      return { error };
    }

    componentDidMount() {
      this.isComponentMounted = true;
      this.emit(EventNames.VIEW_MOUNTED, {
        buildId: this.config.buildId,
        sourceId: this.config.sourceId,
      });
      Object.values(this.producers).forEach((x) => x.mount());
      this.viewProducer.mount();
      this.viewStateProducer.mount();
    }
    componentWillUnmount() {
      this.isComponentMounted = false;
      if (sourceId) {
        this.context.removeViewInstance(sourceId, this.id);
      }

      this.emit(EventNames.VIEW_UNMOUNTED);
      Object.values(this.producers).forEach((x) => {
        x.unmount();
      });

      this.viewProducer.unmount();
      this.viewStateProducer.unmount();
    }
    updateData(data: any) {
      // because the view data binding comes from a producer
      // the data will contain all private props from the
      // producer which should be deleted from the view
      // unless it was provided explicitly as a prop
      if (!this.viewContext.props._producerId) {
        delete data._producerId;
      }

      this.stateUpdate = {
        data,
        done: false,
      };

      if (!this.isComponentMounted) {
        return;
      }

      setImmediate(() => {
        if (!this.isComponentMounted) {
          return;
        }
        if (!this.isStateReady) {
          this.isStateReady = true;
        }
        if (this.stateUpdate.done) {
          return;
        }
        this.stateUpdate.done = true;
        this.setState({
          data: this.stateUpdate.data,
          //TODO: check if there is a circular probability of error
          error: null,
        });
      });
    }
    onMount() {
      // const parentId = getParentId(this.ref, null);
      const root = this.context.getRoot().querySelector(`[data-viewid]`);
      const view = this.context
        .getRoot()
        .querySelector(`[data-viewid="${this.id}"]`);

      if (!root || !view || !this._update) {
        return;
      }

      const parentId = getParentId(view, root);

      this._update(pathFn("views", this.id)).merge({
        rootId: root.getAttribute("data-viewid"),
        parentId,
      });

      this._update(pathFn("views", parentId, "children", this.id)).set(
        this.createdAt
      );
    }

    componentDidCatch(error: any, errorInfo: any) {
      // You can also log the error to an error reporting service
      console.error("componentDidCatch", error, errorInfo);
    }
    //TODO: Add shouldComponentUpdate in order to separate
    // the actual used props and the props that are given
    // to the component in order to optimise rendering in some
    // cases
    render() {
      // TODO: anyway of knowing if the props changed?
      Object.values(this.producers).forEach((x) => {
        x.updateExternal(this.props);
      });
      this.viewProducer.updateExternal(this.props);
      if (!this.isStateReady) {
        return null;
      }
      if (this.state.error) {
        let fallbackElement;
        try {
          fallbackElement = this.context.errorFallback(
            this.state.error,
            this.id,
            this.config.meta
          );
        } catch (e) {
          fallbackElement = (
            <DefaultError error={this.state.error} viewId={this.id} />
          );
        }
        return (
          <ErrorBoundary viewId={this.id}>{fallbackElement}</ErrorBoundary>
        );
      }
      return (
        <RenderComponent
          onMount={() => {
            this.onMount();
          }}
          viewId={this.id}
          state={this.state}
          fn={this.fn}
        />
      );
    }
  };
}
