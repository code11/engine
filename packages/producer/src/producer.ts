import { DB } from "jsonmvc-datastore";
import {
  ProducerContext,
  ProducerConfig,
  ProducerFn,
  ProducerInstance,
  ExternalProps,
  StructOperation,
} from "@c11/engine-types";

import { Graph } from "./graph";

enum ProducerStates {
  MOUNTED,
  UNMOUNTED,
}

// TODO: Add Ref.isValid() which can test if data at that location
// is according to the schema

export class Producer implements ProducerInstance {
  private state: ProducerStates = ProducerStates.UNMOUNTED;
  private db: DB;
  private args: StructOperation;
  private fn: ProducerFn;
  private external: ExternalProps;
  private graph: Graph;
  private keepReferences: string[];
  private stats = {
    executionCount: 0,
  };
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.args = config.args;
    this.fn = config.fn;
    this.external = context.props || {};
    this.keepReferences = context.keepReferences || [];
    this.graph = new Graph(
      this.db,
      this.external,
      this.args,
      context.debug ? this.fnWrapper.bind(this) : this.fn,
      this.keepReferences
    );
  }
  private fnWrapper(...params: any[]) {
    this.stats.executionCount += 1;
    this.fn.apply(null, params);
  }
  mount() {
    if (this.state === ProducerStates.MOUNTED) {
      return this;
    }
    this.graph.listen();
    this.state = ProducerStates.MOUNTED;
    return this;
  }
  unmount() {
    if (this.state === ProducerStates.UNMOUNTED) {
      return this;
    }
    this.graph.destroy();
    this.state = ProducerStates.UNMOUNTED;
    return this;
  }
  updateExternal(props: ProducerContext["props"]) {
    if (props) {
      this.external = props;
      this.graph.updateExternal(this.external);
    }
    return this;
  }
  getStats() {
    return this.stats;
  }
}
