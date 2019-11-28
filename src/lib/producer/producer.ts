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
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.args = config.args;
    this.argsNew = {
      type: OperationTypes.STRUCT,
      value: config.args
    };
    this.fn = config.fn;
    this.external = context.props || {};
  }
  mount() {
    if (this.state === ProducerStates.MOUNTED) {
      return this;
    }

    const generateDepsGraph = (ops: StructOperation['value'], ns?: string) => {
      let deps: Dependencies = {};
      Object.keys(ops).map(x => {
        const op = ops[x];
        deps = merge(deps, getDeps(op, x, ns));
      });
      return deps;
    };

    this.deps = generateDepsGraph(this.args);

    const getDepsOrder = (deps: Dependencies) => {
      return Object.keys(deps).sort((a, b) => {
        if (deps[b].internal.includes(a)) {
          return -1;
        } else {
          return 1;
        }
      });
    };

    this.order = getDepsOrder(this.deps);

    const computeData = (external: any, args: any, deps: any, order: any) => {
      const data: any = {};
      order.map((x: any) => {
        const path = toPath(x);
        const op: Operation = path.reduce((acc, x) => {
          if (acc[x].type === OperationTypes.STRUCT) {
            acc = acc[x].value;
          } else {
            acc = acc[x];
          }
          return acc;
        }, args);

        const resolver = operations[op.type];
        set(data, path, resolver(this.db, external, data, op));
      });

      return data;
    };

    const finalData = computeData(
      this.external,
      this.args,
      this.deps,
      this.order
    );

    /**
     * path schema:
     * 'color.name': (deps) => `/known/${deps.first}/${deps.second}`,
     * 'bar.baz': '/foo/bar/baz' -> this is static
     *
     * go through the path schema and attach listeners to valid paths
     * when a value changes for then get all the deps of that value
     * for each dep of that value unsubscribe the path listener
     * and create a new one if the path can be computed
     */
    /*

*/

    this.fn(finalData);

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
