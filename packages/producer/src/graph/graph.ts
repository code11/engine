import merge from "lodash/merge";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";
import {
  StructOperation,
  OperationTypes,
  GraphData,
  GraphStructure,
  GraphNodeType,
} from "@c11/engine-types";
import { resolveDependencies } from "./resolveDependencies";
import { getExternalNodes } from "./getExternalNodes";
import { getInternalNodes } from "./getInternalNodes";
import { resolveOrder } from "./resolveOrder";
import { DB } from "jsonmvc-datastore";
import { getOperation } from "./getOperation";
import { ComputeType, computeOperation } from "./computeOperation";
import { pathListener } from "./pathListener";
import { funcOperation } from "./funcOperation";
import { getOrderedParams } from "./getOrderedParams";

export class Graph {
  private structure: GraphStructure;
  private computeOrder: string[];
  private paramsOrder: string[];
  db: DB;
  props: any;
  data: GraphData = {};
  cb: Function;
  constructor(db: DB, props: any, op: StructOperation, cb: Function) {
    if (!op.meta || !op.meta.order) {
      throw new Error("Missing order for arguments list");
    }
    const struct = merge(getInternalNodes(op), getExternalNodes(props));
    resolveDependencies(struct);
    this.props = props;
    this.structure = struct;
    this.db = db;
    this.computeOrder = resolveOrder(struct);
    this.paramsOrder = op.meta.order;
    this.cb = cb;
  }
  compute() {
    const data = this.computeOrder.reduce((acc, x) => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        const result = computeOperation(this.db, this.structure, node);
        if (result.value) {
          if (result.type === ComputeType.PATH) {
            node.path = result.value;
            node.value = this.db.get(result.value);
          } else if (result.type === ComputeType.VALUE) {
            node.value = result.value;
          }
        }
        set(acc, node.nesting, node.value);
      }
      return acc;
    }, {});
    return data;
  }

  updateExternal(props: any) {
    // TODO: What happens when invalid props or no props are passed,
    // how should this be propagated
    if (!props) {
      return;
    }
    if (JSON.stringify(props) === JSON.stringify(this.props)) {
      return;
    }
    this.props = props;

    Object.keys(props).forEach(x => {
      const id = `external.${x}`;
      if (this.structure[id]) {
        this.structure[id].value = props[x];
      }
    });

    setImmediate(() => {
      this.data = this.compute();
      this.update();
    });
  }
  update() {
    const params = getOrderedParams(cloneDeep(this.data), this.paramsOrder);
    this.cb.apply(null, params);
  }

  listen() {
    this.data = this.compute();
    this.update();

    this.computeOrder.forEach(x => {
      const node = this.structure[x];
      if (node.type === GraphNodeType.INTERNAL) {
        if (node.op.type === OperationTypes.GET) {
          const path = getOperation(this.structure, node.op);
          if (path) {
            node.removeListener = this.db.on(
              path,
              pathListener(
                this.update.bind(this),
                this.db,
                this.data,
                this.structure,
                node
              )
            );
          }
        } else if (node.op.type === OperationTypes.FUNC) {
          node.op.value.params.forEach((op, i) => {
            if (op.type === OperationTypes.GET) {
              const path = getOperation(this.structure, op);
              if (path) {
                node.removeFuncListeners[i] = this.db.on(path, val => {
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
