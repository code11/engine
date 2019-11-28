import { DB, RemoveListener } from 'jsonmvc-datastore';
import toPath from 'lodash/toPath';
import merge from 'lodash/merge';
import set from 'lodash/set';
import {
  ProducerContext,
  ProducerConfig,
  ProducerArgs,
  ProducerFn,
  ProducerInstance,
  OperationTypes,
  ValueTypes,
  ExternalProps,
  Operation,
  StructOperation
} from './';

import { operations } from './operations';
import { Graph } from './graph';

enum ProducerStates {
  MOUNTED,
  UNMOUNTED
}

// Which arg will be influenced if this is

interface Dependencies {
  [key: string]: {
    internal: string[];
    external: string[];
  };
}

function getDeps(op: Operation, name: string, ns?: string) {
  let deps: Dependencies = {};
  const depName = ns ? `${ns}.${name}` : name;
  if (!deps[depName] && op.type !== OperationTypes.STRUCT) {
    deps[depName] = {
      internal: [],
      external: []
    };
  }

  if (
    op.type === OperationTypes.VALUE &&
    op.value.type === ValueTypes.INTERNAL
  ) {
    deps[depName].internal.push(op.value.path.join('.'));
  }
  if (
    op.type === OperationTypes.VALUE &&
    op.value.type === ValueTypes.EXTERNAL
  ) {
    deps[depName].external.push(op.value.path.join('.'));
  }

  if (op.type === OperationTypes.GET) {
    op.path.forEach(y => {
      if (y.type === ValueTypes.INTERNAL) {
        deps[depName].internal.push(y.path.join('.'));
      } else if (y.type === ValueTypes.EXTERNAL) {
        deps[depName].external.push(y.path.join('.'));
      }
    });
  }

  if (op.type === OperationTypes.STRUCT) {
    let localDeps = {};
    Object.keys(op.value).forEach(x => {
      const localOp = op.value[x];
      localDeps = merge(localDeps, getDeps(localOp, x, depName));
    });
    deps = merge(deps, localDeps);
  }

  if (op.type === OperationTypes.FUNC) {
    let localDeps = {};
    op.value.params.forEach((op: Operation) => {
      localDeps = merge(localDeps, getDeps(op, depName));
    });
    deps = merge(deps, localDeps);
  }
  return deps;
}

// TODO: Add Ref.isValid() which can test if data at that location
// is according to the schema

export class Producer implements ProducerInstance {
  state: ProducerStates = ProducerStates.UNMOUNTED;
  db: DB;
  args: ProducerArgs;
  argsNew: StructOperation;
  fn: ProducerFn;
  external: ExternalProps;
  data: any = {};
  deps: Dependencies = {};
  order: any = [];
  graph: Graph;
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.args = config.args;
    this.argsNew = {
      type: OperationTypes.STRUCT,
      value: config.args
    };
    this.fn = config.fn;
    this.external = context.props || {};
    this.graph = new Graph(this.db, this.external, this.argsNew);
  }
  mount() {
    if (this.state === ProducerStates.MOUNTED) {
      return this;
    }
    const data: any = this.graph.compute();
    this.fn(data);
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
