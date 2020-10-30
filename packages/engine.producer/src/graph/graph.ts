import merge from "lodash/merge";
import set from "lodash/set";
import cloneDeep from "clone-deep";
import isFunction from "lodash/isFunction";
import isEqual from "lodash/isEqual";
import {
  StructOperation,
  OperationTypes,
  GraphData,
  GraphStructure,
  GraphNodeType,
  ValueTypes,
} from "@c11/engine.types";
import { resolveDependencies } from "./resolveDependencies";
import { getExternalNodes } from "./getExternalNodes";
import { getInternalNodes } from "./getInternalNodes";
import { resolveOrder } from "./resolveOrder";
import { DatastoreInstance } from "@c11/engine.types";
import { observeOperation } from "./observeOperation";
import { ComputeType, computeOperation } from "./computeOperation";
import { pathListener } from "./pathListener";
import { funcOperation } from "./funcOperation";
import { updateListeners } from "./updateListeners";
import { wildcard } from "../wildcard";

export class Graph {
  private structure: GraphStructure;
  private computeOrder: string[];
  db: DatastoreInstance;
  props: any;
  data: GraphData = {};
  cb: Function;
  keepReferences: string[];
  constructor(
    db: DatastoreInstance,
    props: any,
    op: StructOperation,
    cb: Function,
    keepReferences: string[]
  ) {
    const struct = merge(getInternalNodes(op), getExternalNodes(props));
    resolveDependencies(struct);
    this.props = props;
    this.structure = struct;
    this.db = db;
    this.keepReferences = keepReferences;
    this.computeOrder = resolveOrder(struct);
    this.cb = cb;
  }
  compute() {
    const data = this.computeOrder.reduce((acc, x) => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        const result = computeOperation(this.db, this.structure, node);
        if (result.type === ComputeType.PATH && result.value) {
          node.path = result.value;
          node.value = this.db.get(result.value);
        } else if (result.type === ComputeType.VALUE) {
          node.value = result.value;
        }
        set(acc, node.nesting, node.value);
      }
      return acc;
    }, {});
    return data;
  }

  updateExternal(props: any) {
    if (!props) {
      return;
    }
    if (isEqual(props, this.props)) {
      return;
    }
    this.props = props;

    Object.keys(props).forEach((x) => {
      const id = `external.${x}`;
      if (this.structure[id]) {
        this.structure[id].value = props[x];
        updateListeners(
          this,
          this.update.bind(this),
          this.db,
          this.data,
          this.structure,
          this.structure[id]
        );
      }
    });
    setImmediate(() => {
      this.data = this.compute();
      this.update();
    });
  }
  update() {
    let data = this.data;
    if (data) {
      const refs = this.keepReferences.reduce((acc, x) => {
        if (this.structure[x]) {
          acc = acc.concat(this.structure[x].isDependedBy);
        }
        return acc;
      }, [] as string[]);
      data = Object.keys(data).reduce((acc: any, x) => {
        const value = data[x];
        if (value === wildcard) {
          const node = this.structure[`internal.${x}`];
          if (node) {
            // There should be only one dependency to a wildcard node
            const depId = node.isDependedBy[0];
            const dep = this.structure[depId];
            if (
              dep.type === GraphNodeType.INTERNAL &&
              dep.op &&
              dep.op.type === OperationTypes.OBSERVE
            ) {
              const idx = dep.op.path.findIndex(
                (y) => y.type === ValueTypes.INTERNAL && y.path[0] === x
              );
              // We assume only one operation per patch for simpicity
              const path =
                dep.fromPatch && dep.fromPatch[0] && dep.fromPatch[0].path;
              if (path) {
                const parts = path.split("/");
                parts.shift();
                const wildcardValue = parts[idx];
                if (wildcardValue) {
                  acc[x] = wildcardValue;
                }
              }
            }
          }
        } else if (refs.includes(`internal.${x}`) || isFunction(data[x])) {
          acc[x] = value;
        } else {
          acc[x] = cloneDeep(value);
        }

        return acc;
      }, {});
    }
    this.cb.call(null, data);
  }

  destroy() {
    this.computeOrder.forEach((x) => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        if (node.removeListener) {
          node.removeListener();
        }
      }
    });
  }
  listen() {
    this.data = this.compute();
    this.update();

    this.computeOrder.forEach((x) => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        if (node.op.type === OperationTypes.OBSERVE) {
          const path = observeOperation(this.structure, node.op);
          if (path) {
            const listener = pathListener(
              this,
              this.update.bind(this),
              this.db,
              this.data,
              this.structure,
              node
            );
            node.listener = listener;
            node.removeListener = this.db.on(path, listener);
          }
        } else if (node.op.type === OperationTypes.FUNC) {
          node.op.value.params.forEach((op, i) => {
            if (op.type === OperationTypes.OBSERVE) {
              const path = observeOperation(this.structure, op);
              if (path) {
                if (node.removeFuncListeners[i]) {
                  node.removeFuncListeners[i]();
                }
                node.removeFuncListeners[i] = this.db.on(path, (val) => {
                  if (node.op.type === OperationTypes.FUNC) {
                    const result = funcOperation(
                      this.db,
                      this.structure,
                      node.op
                    );
                    if (result === node.value) {
                      return;
                    }
                    node.value = result;
                    set(this.data, node.nestingPath, result);
                    this.update();
                  }
                });
              }
            }
          });
        }
      }
    });
  }
}
