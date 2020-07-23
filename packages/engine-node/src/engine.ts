import db from "@c11/engine.db";
import { Producer } from "@c11/engine.producer";
import {
  EngineConfig,
  ProducerInstance,
  ProducerContext,
} from "@c11/engine.types";

enum EngineState {
  NOT_INITIALIZED,
  RUNNING,
  STOPPED,
}

export class Engine {
  state: EngineState = EngineState.NOT_INITIALIZED;
  private config: EngineConfig;
  private producers: ProducerInstance[] | null = null;
  private context: ProducerContext;
  constructor(config: EngineConfig) {
    this.config = config;
    let initialState = {};
    if (config.state && config.state.initial) {
      initialState = config.state.initial;
    }
    this.context = {
      db: db(initialState),
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

    this.state = EngineState.RUNNING;
  }

  // private resume() {}

  /**
   * Mounts the application and the producers.
   * ```
   * const engine = new Engine(config).start()
   * ```
   */
  start(): Engine {
    if (this.state === EngineState.NOT_INITIALIZED) {
      this.init();
    } else if (this.state === EngineState.STOPPED) {
      // this.resume();
    } else {
      // nothing, engine already running
    }
    return this;
  }
  // stop() {}
  // update() {
  // }
}
