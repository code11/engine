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
  state: ProducerStates = ProducerStates.UNMOUNTED;
  db: DB;
  args: StructOperation;
  fn: ProducerFn;
  external: ExternalProps;
  graph: Graph;
  keepReferences: string[];
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
      this.fn,
      this.keepReferences
    );
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
}
