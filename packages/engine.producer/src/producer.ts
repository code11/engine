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
import isFunction from "lodash/isFunction";
import isEqual from "lodash/isEqual";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isNil from "lodash/isNil";
import isRegExp from "lodash/isRegExp";
import shortid from "shortid";
import { Graph } from "./graph";
import { UpdateOperationSymbol } from "./graph/updateOperation";
import { GetOperationSymbol } from "./graph/getOperation";
import { stringifyPath } from "./graph/stringifyPath";

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
  private results: any[] = [];
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
      this.fnWrapper.bind(this),
      this.keepReferences
    );
  }
  private fnWrapper(params: { [k: string]: any }) {
    this.stats.executionCount += 1;
    if (this.debug) {
      //TODO: this should be recursive to account for nested paths
      // const a: producer = ({ a = { foo: get.foo }}) => {}
      const loc = `${this.meta.relativeFilePath}:${this.meta.name}`;
      const logParams = Object.keys(params).reduce((acc, x: string) => {
        const val = params[x];
        const op = val?.__operation__;
        const symbol = op?.symbol;
        if (isEqual(symbol, GetOperationSymbol)) {
          acc[x] = `[[get.${stringifyPath(op.path)}]]`;
          const value = val.value;
          //TODO: add includes, length
          val.value = (...args: any[]) => {
            const result = value.apply(null, args);
            let argsValue = "";
            if (args.length > 0) {
              argsValue = JSON.stringify(args);
            }
            console.log(`${loc}:${x}.value(${argsValue}) ->`, result);
            return result;
          };
        } else if (isEqual(symbol, UpdateOperationSymbol)) {
          //TODO: add same call logic from get ^^^
          acc[x] = `[[update.${stringifyPath(op.path)}]]`;
        } else if (
          isPlainObject(val) ||
          isArray(val) ||
          isNumber(val) ||
          isBoolean(val) ||
          isString(val) ||
          isNil(val) ||
          isRegExp(val)
        ) {
          acc[x] = params[x];
        } else if (val?.constructor?.name) {
          acc[x] = `$$${val.constructor.name}`;
        } else {
          acc[x] = params[x];
        }
        return acc;
      }, {} as { [k: string]: any });
      console.log(loc, logParams);
    }
    const result = this.fn.call(null, params);
    if (result !== undefined && isFunction(result)) {
      this.results.push(result);
    }
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
    this.results.forEach((x) => {
      if (x) {
        x();
      }
    });
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
