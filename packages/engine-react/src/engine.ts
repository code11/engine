import db from "@c11/engine.db";
import { Producer } from "@c11/engine.producer";
import { Render, view } from "./react";
import {
  EngineApi,
  EngineConfig,
  ProducerInstance,
  ProducerContext,
  RenderInstance,
  ViewInstance,
} from "@c11/engine.types";

enum EngineState {
  NOT_INITIALIZED,
  RUNNING,
  STOPPED,
}

export { view };

export class Engine implements EngineApi {
  state: EngineState = EngineState.NOT_INITIALIZED;
  private config: EngineConfig;
  private producers: ProducerInstance[];
  private render: RenderInstance | null = null;
  private context: ProducerContext;
  private views: ViewInstance[];
  constructor(config: EngineConfig) {
    this.config = config;
    this.views = [];
    this.producers = [];
    let initialState = {};
    if (config.state && config.state.initial) {
      initialState = config.state.initial;
    }
    this.context = {
      db: db(initialState),
      addView: this.addView.bind(this),
      debug: config.debug,
    };
    if (config.autostart || config.autostart === undefined) {
      this.start();
    }
  }

  private init() {
    if (this.config.producers) {
      this.producers = this.config.producers.list.map((config) => {
        const producer = new Producer(config, this.context);
        producer.mount();
        return producer;
      });
    }

    if (this.config.view) {
      this.render = new Render(this.context, this.config.view);
      this.render.mount();
    }

    this.state = EngineState.RUNNING;
  }
  private addView(view: ViewInstance) {
    this.views.push(view);
  }
  getProducers() {
    const viewsProducers = this.views.reduce((acc, x) => {
      acc = acc.concat(x.producers);
      return acc;
    }, [] as ProducerInstance[]);
    return [...this.producers, ...viewsProducers];
  }
  // private resume() {}

  /**
   * Mounts the application and the producers.
   * ```
   * const engine = new Engine(config).start()
   * ```
   */
  start() {
    if (this.state === EngineState.NOT_INITIALIZED) {
      this.init();
    } else if (this.state === EngineState.STOPPED) {
      // this.resume();
    } else {
      // nothing, engine already running
    }
    return this;
  }

  getContext() {
    return this.context;
  }

  getRoot() {
    if (this.render) {
      return this.render.getRoot();
    } else {
      return null;
    }
  }

  stop() {
    return this;
  }
  // update() {
  // for views ReactDOM.unmountComponentAtNode(container)
  // }
}
