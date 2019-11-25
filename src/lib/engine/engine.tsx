import db from 'jsonmvc-datastore';
import { EngineConfig } from './';
import {
  ProducerInstance,
  ProducerContext,
  Producer,
  Render,
  RenderInstance
} from '../index';

enum EngineState {
  NOT_INITIALIZED,
  RUNNING,
  STOPPED
}

export class Engine {
  state: EngineState = EngineState.NOT_INITIALIZED;
  private config: EngineConfig;
  private producers: ProducerInstance[] | null = null;
  private render: RenderInstance | null = null;
  private context: ProducerContext;
  constructor(config: EngineConfig) {
    this.config = config;
    this.context = {
      db: db(config.state.default)
    };
  }

  private init() {
    const { view, producers } = this.config;
    if (producers) {
      this.producers = producers.list.map(config => {
        const producer = new Producer(config, this.context);
        producer.mount();
        return producer;
      });
    }
    if (view) {
      this.render = new Render(this.context, view.element, view.root);
      this.render.mount();
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
  // for views ReactDOM.unmountComponentAtNode(container)
  // }
}
