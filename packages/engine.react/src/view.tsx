import React, { isValidElement } from "react";
import ViewContext from "./context";
import { BaseProps, BaseState } from "./types";
import { getParentId } from "./getParentId";
import { isProducer } from "./isProducer";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import {
  GraphNodeType,
  ValueSerializer,
  ProducerFn,
  ViewConfig,
  ViewInstance,
  ProducerConfig,
  ExternalProducerContext,
  StructOperation,
  OperationTypes,
  UpdateValue,
} from "@c11/engine.types";
import { now } from "@c11/engine.producer";
import type { ProducerInstance } from "@c11/engine.types";
import { RenderComponent } from "./renderComponent";
import type { RenderContext } from "./render";
import { customAlphabet } from "nanoid";
import { PathType } from "@c11/engine.types";
import { pathFn } from "@c11/engine.runtime";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
  15
);

export const childrenSerializer: ValueSerializer = {
  type: GraphNodeType.EXTERNAL,
  name: "children",
  serializer: (value) => {
    if (
      value instanceof Array &&
      value.includes((x: any) => !isValidElement(x))
    ) {
      return;
    } else if (!isValidElement(value)) {
      return;
    }
    const result = JSON.stringify(value, circular());
    return result;
  },
};

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

const circular = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (key.startsWith("_")) {
      return;
    }
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

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
    static contextType = ViewContext;
    static displayName = `${config.meta?.relativeFilePath}::${config.meta?.name}:${config.meta?.location?.start.line}`;
    stateUpdate: any = {};
    fn: any;
    isComponentMounted: boolean = false;
    viewProps: StructOperation;
    producers: { [k: string]: ProducerInstance } = {};
    isStateReady = false;
    viewProducer: ProducerInstance;
    viewStateProducer: ProducerInstance;
    viewContext: ExternalProducerContext;
    _update: ((path: any) => UpdateValue<any, any>) | undefined;
    ref: any;
    id: string;
    static producers(
      newProducers:
        | ProducerConfig[]
        | ProducerConfig
        | { [k: string]: ProducerConfig }
    ) {
      let producersList: ProducerConfig[] = [];
      if (isProducer(newProducers)) {
        producersList = [newProducers as ProducerConfig];
      } else if (isPlainObject(newProducers)) {
        producersList = Object.values(newProducers);
      } else if (isArray(newProducers)) {
        producersList = newProducers;
      }
      producers = producers.concat(producersList);
      // TODO: should throw an error if the same producer is used twice
      // check using sourceId in development
      if (setProducers) {
        setProducers(sourceId, producersList);
      }
    }
    static isView = true;
    constructor(externalProps: BaseProps, context: RenderContext) {
      super(externalProps, context);

      this.id = nanoid();
      const viewContext = {
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
            createdAt: now(),
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
              const producerId = x.sourceId || nanoid();
              this.producers[producerId] = producer;
            });
          },
        });
      }
      producers.forEach((x: any) => {
        const id = x.sourceId || nanoid();
        this.producers[id] = context.addProducer(x, viewContext, {
          viewId: this.id,
          viewSourceId: sourceId,
        });
      });
      this.state = { data: {} };
      this.context = context;
    }
    componentDidMount() {
      this.isComponentMounted = true;
      Object.values(this.producers).forEach((x) => x.mount());
      this.viewProducer.mount();
      this.viewStateProducer.mount();
    }
    componentWillUnmount() {
      this.isComponentMounted = false;
      if (sourceId) {
        this.context.removeViewInstance(sourceId, this.id);
      }
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
    }
    render() {
      // TODO: anyway of knowing if the props changed?
      Object.values(this.producers).forEach((x) => {
        x.updateExternal(this.props);
      });
      this.viewProducer.updateExternal(this.props);
      if (!this.isStateReady) {
        return null;
      }
      return (
        <RenderComponent
          onMount={() => {
            this.onMount();
          }}
          viewId={this.id}
          ref={this.ref}
          state={this.state}
          fn={this.fn}
        />
      );
    }
  };
}
