import { DB, RemoveListener } from 'jsonmvc-datastore';
import get from 'lodash/get';
import toPath from 'lodash/toPath';
import merge from 'lodash/merge';
import set from 'lodash/set';
import {
  ProducerContext,
  ProducerConfig,
  ProducerArgs,
  ProducerFn,
  ProducerInstance,
  OperationsStruct,
  OperationTypes,
  StaticValue,
  ValueTypes,
  ExternalProps,
  RefDataType,
  Operations,
  GetOperation,
  MergeOperation,
  SetOperation,
  StructOperation
} from './';

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

type PathBuilder = (deps: { [key: string]: any }) => void;
type ValueBuilder = (deps: { [key: string]: any }) => void;

interface PathSchema {
  [key: string]: {
    type: OperationTypes;
    value: any;
    dependsOn: {
      internal: string[];
      external: string[];
      invoke: string[];
    };
    isDependedBy: string[];
    removeListener: RemoveListener | null;
    getPath?: PathBuilder;
    getValue?: ValueBuilder;
  };
}

function getDeps(op: Operations, name: string, ns?: string) {
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
    op.value.params.forEach((op: Operations) => {
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
  fn: ProducerFn;
  external: ExternalProps;
  data: any = {};
  deps: Dependencies = {};
  order: any = [];
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.args = config.args;
    this.fn = config.fn;
    this.external = context.props || {};
  }
  mount() {
    if (this.state === ProducerStates.MOUNTED) {
      return this;
    }

    const generateDepsGraph = (ops: OperationsStruct, ns?: string) => {
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

    const resolveValue = (external: any, data: any, value: StaticValue) => {
      if (value.type === ValueTypes.CONST) {
        return value.value;
      } else if (value.type === ValueTypes.EXTERNAL) {
        return get(external, value.path);
      } else if (value.type === ValueTypes.INTERNAL) {
        return get(data, value.path);
      }
    };

    /*
    type OperationResolver = {
      [key in OperationTypes]: (
        external: any,
        data: any,
        op: Operations
      ) => any;
    };

    const resolveOperation: OperationResolver = {
      [OperationTypes.GET]: (external: any, data: any, op: GetOperation) => {
        const getPath = op.path.map((x: any) => {
          return resolveValue(external, data, x);
        });
        const finalPath = '/' + getPath.join('/');
        return this.db.get(finalPath);
      }
    };
    */

    type OperationResolver = (external: any, data: any, op: Operations) => any;

    type OperationResolvers = {
      [key in OperationTypes]: OperationResolver;
    };

    const resolveOperation: OperationResolvers = {
      [OperationTypes.GET]: (e: any, d: any, op: GetOperation) => '123',
      [OperationTypes.MERGE]: (e: any, d: any, op: MergeOperation) => '123',
      [OperationTypes.SET]: (e: any, d: any, op: SetOperation) => '123',
      [OperationTypes.STRUCT]: (e: any, d: any, op: StructOperation) => '123',
      [OperationTypes.VALUE]: (e: any, d: any, op: ValueOperation) => '123',
      [OperationTypes.FUNC]: (e: any, d: any, op: FuncOperation) => '123',
      [OperationTypes.REF]: (e: any, d: any, op: RefOperation) => '123'
    };

    const computeData = (external: any, args: any, deps: any, order: any) => {
      const data: any = {};
      order.map((x: any) => {
        const path = toPath(x);
        const op = path.reduce((acc, x) => {
          if (acc[x].type === OperationTypes.STRUCT) {
            acc = acc[x].value;
          } else {
            acc = acc[x];
          }
          return acc;
        }, args);

        const resolver = resolveOperation[op.type];

        set(data, path, resolver(external, data, op));

        if (op.type === OperationTypes.VALUE) {
          set(data, path, resolveValue(external, data, op.value));
        } else if (op.type === OperationTypes.GET) {
          const getPath = op.path.map((x: any) => {
            return resolveValue(external, data, x);
          });
          const finalPath = '/' + getPath.join('/');
          set(data, path, this.db.get(finalPath));
        } else if (op.type === OperationTypes.SET) {
          const setFn = (value: any, params: any) => {
            const setPath = op.path.map((x: any) => {
              if (x.type === ValueTypes.INVOKE) {
                return params && params[x.name];
              } else {
                return resolveValue(external, data, x);
              }
            });
            const finalPath = '/' + setPath.join('/');
            this.db.patch([
              {
                op: 'add',
                path: finalPath,
                value: value
              }
            ]);
          };
          set(data, path, setFn);
        } else if (op.type === OperationTypes.MERGE) {
          const setFn = (value: any, params: any) => {
            const setPath = op.path.map((x: any) => {
              if (x.type === ValueTypes.INVOKE) {
                return params && params[x.name];
              } else {
                return resolveValue(external, data, x);
              }
            });
            const finalPath = '/' + setPath.join('/');
            this.db.patch([
              {
                op: 'merge',
                path: finalPath,
                value: value
              }
            ]);
          };
          set(data, path, setFn);
        } else if (op.type === OperationTypes.FUNC) {
        } else if (op.type === OperationTypes.REF) {
          const refGet = (params: any) => {
            const setPath = op.path.map((x: any) => {
              if (x.type === ValueTypes.INVOKE) {
                return params && params[x.name];
              } else {
                return resolveValue(external, data, x);
              }
            });
            const finalPath = '/' + setPath.join('/');
            return this.db.get(finalPath);
          };
          const refSet = (value: any, params: any) => {
            const setPath = op.path.map((x: any) => {
              if (x.type === ValueTypes.INVOKE) {
                return params && params[x.name];
              } else {
                return resolveValue(external, data, x);
              }
            });
            const finalPath = '/' + setPath.join('/');
            this.db.patch([
              {
                op: 'add',
                path: finalPath,
                value: value
              }
            ]);
          };
          const refMerge = (value: any, params: any) => {
            const setPath = op.path.map((x: any) => {
              if (x.type === ValueTypes.INVOKE) {
                return params && params[x.name];
              } else {
                return resolveValue(external, data, x);
              }
            });
            const finalPath = '/' + setPath.join('/');
            this.db.patch([
              {
                op: 'merge',
                path: finalPath,
                value: value
              }
            ]);
          };

          const ref: RefDataType = {
            merge: refMerge,
            get: refGet,
            set: refSet
          };
          set(data, path, ref);
        }
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
interface PathSchema {
  [key: string]: {
    type: OperationTypes;
    value: any;
    dependsOn: {
      internal: string[];
      external: string[];
      invoke: string[];
    };
    isDependedBy: string[];
    unsubscribe: () => void;
    path: PathBuilder;
  };
}
*/

    const getOpSchema = (op: Operations, ns: string) => {
      let schema: PathSchema = {};
      if (op.type === OperationTypes.STRUCT) {
        Object.keys(op.value).forEach(x => {
          schema = merge(schema, getOpSchema(op.value[x], `${ns}.${x}`));
        });
      } else {
        schema[ns] = {
          type: op.type,
          value: null,
          dependsOn: {
            internal: [],
            external: [],
            invoke: []
          },
          isDependedBy: [],
          removeListener: null
        };
      }
      return schema;
    };

    const generatePathSchema = (args: ProducerArgs) => {
      let schema = {};
      Object.keys(args).forEach(x => {
        schema = merge(schema, getOpSchema(args[x], x));
      });
      return schema;
    };

    const schema = generatePathSchema(this.args);

    // console.log(schema);

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
