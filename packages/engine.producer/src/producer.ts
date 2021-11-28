import {
  DatastoreInstance,
  ProducerContext,
  ProducerConfig,
  ProducerFn,
  ProducerInstance,
  ExternalProps,
  StructOperation,
  ProducerMeta,
  ValueSerializer,
  PassthroughOperation,
  OperationTypes,
  EventNames,
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
import { randomId } from "@c11/engine.utils";
import isPromise from "is-promise";
import { Graph } from "./graph";
import { now } from "@c11/engine.utils";
import { UpdateOperationSymbol } from "./graph/updateOperation";
import { GetOperationSymbol } from "./graph/getOperation";
import { stringifyPath } from "./graph/stringifyPath";
import { PassthroughGraph } from "./graph/passthroughGraph";

enum ProducerStates {
  MOUNTED,
  UNMOUNTED,
}

// TODO: Add Ref.isValid() which can test if data at that location
// is according to the schema

export class Producer implements ProducerInstance {
  private state: ProducerStates = ProducerStates.UNMOUNTED;
  private config: ProducerConfig;
  private db: DatastoreInstance;
  private context: ProducerContext;
  private props: StructOperation | PassthroughOperation;
  private fn: ProducerFn;
  private external: ExternalProps;
  private graph: Graph | PassthroughGraph;
  private debug: boolean;
  private keepReferences: string[];
  private meta: ProducerMeta;
  private serializers: ValueSerializer[];
  private results: any[] = [];
  private emit: ProducerContext["emit"];
  private stats = {
    executionCount: 0,
  };
  id: string;
  sourceId: string;
  constructor(config: ProducerConfig, context: ProducerContext) {
    this.db = context.db;
    this.config = config;
    this.id = randomId();
    this.context = context;
    const emit: ProducerContext["emit"] = (
      name,
      payload = {},
      context = {}
    ) => {
      this.context.emit &&
        this.context.emit(name, payload, {
          ...context,
          producerId: this.id,
        });
    };
    this.emit = emit.bind(this);
    this.props = config.props;
    this.fn = config.fn;
    this.external = {
      ...context.props,
    };

    if (
      !this.external._now &&
      config.props.type === OperationTypes.STRUCT &&
      config.props.value._now
    ) {
      this.external._now = now;
    }
    if (
      !this.external._producerId &&
      config.props.type === OperationTypes.STRUCT &&
      config.props.value._producerId
    ) {
      this.external._producerId = this.id;
    }
    this.debug = context.debug || false;
    this.meta = config.meta || {};
    this.sourceId = `${config.meta?.absoluteFilePath}:${config.meta?.name}`;
    this.keepReferences = context.keepReferences || [];
    this.serializers = context.serializers || [];

    if (this.props.type === OperationTypes.STRUCT) {
      this.graph = new Graph(
        this.db,
        this.external,
        this.props,
        this.fnWrapper.bind(this),
        this.keepReferences,
        this.serializers
      );
    } else if (this.props.type === OperationTypes.PASSTHROUGH) {
      this.graph = new PassthroughGraph(
        this.external,
        this.fnWrapper.bind(this)
      );
    } else {
      throw new Error(`Not recogonized operation type ${this.props}`);
    }
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
          val.value = (...props: any[]) => {
            const result = value.apply(null, props);
            let propsValue = "";
            if (props.length > 0) {
              propsValue = JSON.stringify(props);
            }
            console.log(`${loc}:${x}.value(${propsValue}) ->`, result);
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
    this.emit(EventNames.PRODUCER_CALLED, params);
    const result = this.fn.call(null, params);

    if (isFunction(result)) {
      this.results.push(result);
    } else if (isPromise(result)) {
      result.then((cb) => {
        if (isFunction(cb)) {
          if (this.state === ProducerStates.UNMOUNTED) {
            cb();
          }
          this.results.push(cb);
        }
      });
    }
  }
  mount() {
    if (this.state === ProducerStates.MOUNTED) {
      return this;
    }
    this.emit(EventNames.PRODUCER_MOUNTED, {
      buildId: this.config.buildId,
      sourceId: this.config.sourceId,
    });
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
    this.emit(EventNames.PRODUCER_UNMOUNTED);
    return this;
  }
  updateExternal(props: ProducerContext["props"]) {
    if (props && props !== this.external) {
      this.external = props;
      this.graph.updateExternal(this.external);
    }
    return this;
  }
  getStats() {
    return this.stats;
  }
}
