import { DB } from 'jsonmvc-datastore';
import {
  ProducerContext,
  ProducerConfig,
  ProducerFn,
  ProducerInstance,
  OperationTypes,
  ExternalProps,
  StructOperation
} from './';

import { Graph } from './graph';

enum ProducerStates {
  MOUNTED,
  UNMOUNTED
}

// Which arg will be influenced if this is

// TODO: Add Ref.isValid() which can test if data at that location
// is according to the schema

export class Producer implements ProducerInstance {
  state: ProducerStates = ProducerStates.UNMOUNTED;
  db: DB;
  args: StructOperation;
  fn: ProducerFn;
  external: ExternalProps;
  graph: Graph;
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.args = {
      type: OperationTypes.STRUCT,
      value: config.args
    };
    this.fn = config.fn;
    this.external = context.props || {};
    this.graph = new Graph(this.db, this.external, this.args);
  }
  mount() {
    if (this.state === ProducerStates.MOUNTED) {
      return this;
    }
    const data = this.graph.compute();
    this.fn(data);
    // this.graph.listen((data: any) => {
    //   this.fn(data);
    // });
    return this;
  }
  unmount() {
    if (this.state === ProducerStates.UNMOUNTED) {
      return this;
    }
    return this;
  }
  update() {
    // prop: 123
    return this;
  }
}
