import React from "react";
import ReactDOM from "react-dom";
import { nanoid } from "nanoid";
import {
  RenderInstance,
  RootElement,
  EngineModuleSource,
  ModuleContext,
  ProducerConfig,
  ViewConfig,
  ProducerContext,
  ProducerInstance,
  ExternalProducerContext,
} from "@c11/engine.types";
import { ViewProvider } from "./context";

export type ModuleConfig = {
  debug?: boolean;
  updateProps?: (props: any) => void;
};

type ProducerConfigs = {
  [k: string]: ProducerConfig;
};

//TODO: Copy key={} code to avoid key issue

export type RenderContext = {
  debug: boolean;
  addProducer: (
    config: ProducerConfig,
    context: ExternalProducerContext,
    opts: AddProducerOpts
  ) => ProducerInstance;
  subscribeViewInstance: (
    sourceId: string,
    instanceId: string,
    instanceApi: InstanceApi
  ) => void;
  removeViewInstance: (sourceId: string, instanceId: string) => void;
  setProducers: (sourceId: string, producers: ProducerConfig[]) => void;
  getProducers: (sourceId: string) => ProducerConfig[] | void;
  registerView: (sourceId: string, config: ViewConfig) => void;
  getRoot: () => RootElement;
};

type RenderConfig = {
  moduleContext: ModuleContext;
  debug: boolean;
  container: any;
  element: any;
  updateProps?: any;
};

type InstanceApi = {
  replaceView: (config: ViewConfig) => void;
  replaceProducers: (producers: ProducerConfig[]) => void;
  replaceProducer: (producerSourceId: string, config: ProducerConfig) => void;
};

type RenderCache = {
  [k: string]: {
    config: ViewConfig;
    producers: ProducerConfigs;
    unsubscribeProducers: {
      [k: string]: () => void;
    };
    unsubscribeView: () => void;
    instances: {
      [k: string]: InstanceApi;
    };
  };
};

type AddProducerOpts = {
  viewSourceId: string;
  viewId: string;
};

const wrapper = ({ Element, updateProps }: any) => {
  return class Wrapper extends React.Component {
    isAlreadyMounted = false;
    nextState: any;
    constructor(props: any) {
      super(props);
      if (updateProps) {
        updateProps(this.updateProps.bind(this));
      }
      this.state = {};
    }
    componentDidMount() {
      this.isAlreadyMounted = true;
      if (this.nextState) {
        this.setState(this.nextState);
      }
    }
    updateProps(props: any) {
      if (!this.isAlreadyMounted) {
        this.nextState = props;
      } else {
        this.setState(props);
      }
    }
    render() {
      return React.cloneElement(Element, { ...this.state });
    }
  };
};

export class Render implements RenderInstance {
  private element: any;
  private container: any;
  private debug: boolean;
  private root: RootElement = null;
  private context: RenderContext;
  private moduleContext: ModuleContext;
  private cache: RenderCache = {};
  private updateProps: (cb: (props: any) => void) => void;

  constructor(config: RenderConfig) {
    this.debug = config.debug || false;
    this.element = config.element;
    this.container = config.container;
    this.moduleContext = config.moduleContext;
    this.updateProps = config.updateProps;
    this.context = {
      debug: this.debug,
      addProducer: this.addProducer.bind(this),
      subscribeViewInstance: this.subscribeViewInstance.bind(this),
      removeViewInstance: this.removeViewInstance.bind(this),
      setProducers: this.setProducers.bind(this),
      registerView: this.registerView.bind(this),
      getProducers: this.getProducers.bind(this),
      getRoot: this.getRoot.bind(this),
    };
  }

  private updateProducer(producerId: string, config: ProducerConfig) {
    Object.values(this.cache).forEach((x) => {
      if (x.producers[producerId]) {
        x.producers[producerId] = config;
        Object.values(x.instances).forEach((y) => {
          y.replaceProducer(producerId, config);
        });
      }
    });
  }

  private updateView(sourceId: string, config: ViewConfig) {
    if (!this.cache[sourceId]) {
      return;
    }
    this.cache[sourceId].config = config;
    Object.values(this.cache[sourceId].instances).forEach((x) => {
      x.replaceView(config);
    });
  }

  private addProducer(
    config: ProducerConfig,
    context: ExternalProducerContext,
    opts?: AddProducerOpts
  ) {
    if (
      config.sourceId &&
      opts?.viewSourceId &&
      this.cache[opts.viewSourceId] &&
      !this.cache[opts.viewSourceId].unsubscribeProducers[config.sourceId]
    ) {
      const producerSourceId = config.sourceId;
      const viewSourceId = opts.viewSourceId;
      const unsubscribeProducer = this.moduleContext.onSourceUpdate(
        producerSourceId,
        (producerConfig) =>
          this.updateProducer(producerSourceId, producerConfig)
      );
      this.cache[opts.viewSourceId].unsubscribeProducers[producerSourceId] =
        unsubscribeProducer;
    }
    const instance = this.moduleContext.addProducer(config, context);
    return instance;
  }

  private getProducers(sourceId: string) {
    const result = this.cache[sourceId]?.producers;
    if (!result) {
      return;
    }
    return Object.values(result);
  }

  private registerView(sourceId: string, config: ViewConfig) {
    if (this.cache[sourceId]) {
      return;
    }
    this.cache[sourceId] = {
      config,
      unsubscribeProducers: {},
      producers: {},
      instances: {},
      unsubscribeView: this.moduleContext.onSourceUpdate(
        sourceId,
        (viewConfig) => {
          this.updateView(sourceId, viewConfig as ViewConfig);
        }
      ),
    };
  }

  private subscribeViewInstance(
    sourceId: string,
    viewId: string,
    viewApi: InstanceApi
  ) {
    this.cache[sourceId].instances[viewId] = viewApi;
  }

  private removeViewInstance(sourceId: string, viewId: string) {
    if (!this.cache[sourceId] || !this.cache[sourceId].instances[viewId]) {
      return;
    }
    delete this.cache[sourceId].instances[viewId];
  }

  private setProducers(sourceId: string, producers: ProducerConfig[]) {
    if (!this.cache[sourceId]) {
      throw new Error("cannot find source id");
    }

    for (let x of producers) {
      const id = x.sourceId || nanoid();
      this.cache[sourceId].producers[id] = x;
    }
  }

  private render(rootEl: HTMLElement) {
    this.root = rootEl;
    const Wrapper = wrapper({
      Element: this.element,
      updateProps: this.updateProps,
    });
    ReactDOM.render(
      <ViewProvider value={this.context}>
        <Wrapper />
      </ViewProvider>,
      rootEl
    );
  }
  getRoot() {
    return this.root;
  }
  unmount() {
    if (this.root) {
      ReactDOM.unmountComponentAtNode(this.root);
    }
    return this;
  }
  mount() {
    let rootEl;
    if (typeof this.container === "string") {
      rootEl = document.querySelector(this.container);
    } else if (this.container instanceof Function) {
      rootEl = this.container();
      if (typeof rootEl === "string") {
        rootEl = document.querySelector(rootEl);
      }
    } else {
      rootEl = this.container;
    }

    if (rootEl instanceof Promise) {
      rootEl.then((x) => {
        if (typeof x === "string") {
          x = document.querySelector(x);
        }
        this.render(x);
      });
    } else {
      this.render(rootEl);
    }
    return this;
  }
}

export const render = (
  element: any,
  container: any,
  config: ModuleConfig = {}
): EngineModuleSource => {
  let instance: Render | undefined;
  return {
    bootstrap: () => {},
    unmount: () => {
      if (instance) {
        instance.unmount();
        instance = undefined;
      }
    },
    mount: (moduleContext: ModuleContext) => {
      instance = new Render({
        element,
        container,
        debug: config.debug || false,
        updateProps: config.updateProps,
        moduleContext,
      });

      instance.mount();
    },
  };
};
