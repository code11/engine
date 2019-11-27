import { DB } from 'jsonmvc-datastore';
import get from 'lodash/get';
import toPath from 'lodash/toPath';
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
  RefDataType
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
        const depName = ns ? `${ns}.${x}` : x;
        if (!deps[x] && op.type !== OperationTypes.STRUCT) {
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
          const nestedDeps = generateDepsGraph(op.value, depName);
          deps = Object.assign(deps, nestedDeps);
          console.log('nested graph', nestedDeps);
        }
      });
      return deps;
    };

    this.deps = generateDepsGraph(this.args);
    console.log('[deps]', this.deps);

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

    console.log('[order]', this.order);

    const resolveValue = (external: any, data: any, value: StaticValue) => {
      if (value.type === ValueTypes.CONST) {
        return value.value;
      } else if (value.type === ValueTypes.EXTERNAL) {
        return get(external, value.path);
      } else if (value.type === ValueTypes.INTERNAL) {
        return get(data, value.path);
      }
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

        if (op.type === OperationTypes.VALUE) {
          set(data, path, resolveValue(external, data, op.value));
        } else if (op.type === OperationTypes.GET) {
          const getPath = op.path.map((x: any) => {
            return resolveValue(external, data, x);
          });
          console.log('[path]', getPath);
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
            console.log(finalPath);
            this.db.patch([
              {
                op: 'merge',
                path: finalPath,
                value: value
              }
            ]);
          };
          set(data, path, setFn);
        } else if (op.type === OperationTypes.REF) {
          const refGet = (params: any) => {
            console.log('called', params);
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

    const generatePath = (data: any, path: any) => {
      return path.reduce((acc: string, x: any) => {
        if (typeof x === 'string') {
          acc += '/' + x;
        } else {
          if (x.type === 'internal') {
            acc += '/' + data.internal[x.name];
          } else if (x.type === 'external') {
            acc += '/' + data.external[x.name];
          }
        }
        return acc;
      }, '');
    };

    const finalData = computeData(
      this.external,
      this.args,
      this.deps,
      this.order
    );

    this.fn(finalData);

    const internal = {
      foo: '123'
    };
    const external = {};

    const testPath = [
      'firstConst',
      'secondConst',
      { name: 'something', type: 'external' },
      'last'
    ];

    const finalPath = generatePath({ internal, external }, testPath);

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
