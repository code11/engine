import {
  DatastoreInstance,
  ProducerContext,
  ProducerConfig,
  ProducerFn,
  ProducerInstance,
  ExternalProps,
  StructOperation,
  ProducerMeta,
} from "@c11/engine.types";
import shortid from "shortid";

import { Graph } from "./graph";

enum ProducerStates {
  MOUNTED,
  UNMOUNTED,
}

// TODO: Add Ref.isValid() which can test if data at that location
// is according to the schema

export class Producer implements ProducerInstance {
  private state: ProducerStates = ProducerStates.UNMOUNTED;
  private db: DatastoreInstance;
  private args: StructOperation;
  private fn: ProducerFn;
  private external: ExternalProps;
  private graph: Graph;
  private debug: boolean;
  private keepReferences: string[];
  private meta: ProducerMeta;
  private stats = {
    executionCount: 0,
  };
  id: string;
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.id = shortid.generate();
    this.args = config.args;
    this.fn = config.fn;
    this.external = context.props || {};
    this.debug = context.debug || false;
    this.meta = config.meta || {};
    this.keepReferences = context.keepReferences || [];
    this.graph = new Graph(
      this.db,
      this.external,
      this.args,
      this.debug ? this.fnWrapper.bind(this) : this.fn,
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
