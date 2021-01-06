import React from "react";
import ReactDOM from "react-dom";
import { ViewProvider } from "./context";
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
import { nanoid } from "nanoid";

type ModuleConfig = {
  debug?: boolean;
};

type ProducerConfigs = {
  [k: string]: ProducerConfig;
};
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
};

type RenderConfig = {
  moduleContext: ModuleContext;
  debug: boolean;
  container: any;
  element: any;
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

export class Render implements RenderInstance {
  private element: any;
  private container: any;
  private debug: boolean;
  private root: RootElement = null;
  private context: RenderContext;
  private moduleContext: ModuleContext;
  private cache: RenderCache = {};

  constructor(config: RenderConfig) {
    this.debug = config.debug || false;
    this.element = config.element;
    this.container = config.container;
    this.moduleContext = config.moduleContext;
    this.context = {
      debug: this.debug,
      addProducer: this.addProducer.bind(this),
      subscribeViewInstance: this.subscribeViewInstance.bind(this),
      removeViewInstance: this.removeViewInstance.bind(this),
      setProducers: this.setProducers.bind(this),
      registerView: this.registerView.bind(this),
      getProducers: this.getProducers.bind(this),
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
      this.cache[opts.viewSourceId].unsubscribeProducers[
        producerSourceId
      ] = unsubscribeProducer;
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
    this.cache[sourceId].producers = producers.reduce((acc, x) => {
      const id = x.sourceId || nanoid();
      acc[id] = x;
      return acc;
    }, {} as ProducerConfigs);
  }

  private render(rootEl: HTMLElement) {
    this.root = rootEl;
    ReactDOM.render(
      <ViewProvider value={this.context}>{this.element}</ViewProvider>,
      rootEl
    );
  }
  getRoot() {
    return this.root;
  }
  unmount() {
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
  return {
    bootstrap: () => {},
    unmount: () => {},
    mount: (moduleContext: ModuleContext) => {
      const instance = new Render({
        element,
        container,
        debug: config.debug || false,
        moduleContext,
      });

      instance.mount();
    },
  };
};
