import { DB } from 'jsonmvc-datastore';
import {
  ProducerContext,
  ProducerConfig,
  ProducerArgs,
  ProducerFn,
  ProducerInstance
} from './';

enum ProducerStates {
  MOUNTED,
  UNMOUNTED
}

interface ArgsProcessed {
  internal: {};
  external: {};
}

export class Producer implements ProducerInstance {
  state: ProducerStates = ProducerStates.UNMOUNTED;
  db: DB;
  args: ProducerArgs;
  fn: ProducerFn;
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.args = config.args;
    this.fn = config.fn;
  }
  mount() {
    if (this.state === ProducerStates.MOUNTED) {
      return this;
    }

    // get resolve order
    // process args
    // find what args should be passed on at initialization
    // find what args depend on other args

    console.log(this.args);
    return this;
  }
  unmount() {
    if (this.state === ProducerStates.UNMOUNTED) {
      return this;
    }
    return this;
  }
  update() {
    return this;
  }
}
