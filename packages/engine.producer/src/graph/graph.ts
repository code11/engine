import merge from "lodash/merge";
import set from "lodash/set";
import cloneDeep from "clone-deep";
import isFunction from "lodash/isFunction";
import isEqual from "lodash/isEqual";
import {
  ValueSerializer,
  StructOperation,
  OperationTypes,
  GraphData,
  GraphStructure,
  GraphNodeType,
  ValueTypes,
  DatastoreInstance,
} from "@c11/engine.types";
import { resolveDependencies } from "./resolveDependencies";
import { getExternalNodes } from "./getExternalNodes";
import { getInternalNodes } from "./getInternalNodes";
import { resolveOrder } from "./resolveOrder";
import { observeOperation } from "./observeOperation";
import { ComputeType, computeOperation } from "./computeOperation";
import { pathListener } from "./pathListener";
import { funcOperation } from "./funcOperation";
import { updateListeners } from "./updateListeners";
import { getStaticProps } from "./getStaticProps";
import { wildcard } from "../wildcard";

export class Graph {
  private structure: GraphStructure;
  private computeOrder: string[];
  private prevData: any;
  private serializedProps: any;
  private nonSerializedProps: any;
  private destroyed = false;
  db: DatastoreInstance;
  props: any;
  data: GraphData = {};
  cb: Function;
  keepReferences: string[];
  serializers: ValueSerializer[];
  constructor(
    db: DatastoreInstance,
    props: any,
    op: StructOperation,
    cb: Function,
    keepReferences: string[],
    serializers: ValueSerializer[]
  ) {
    const struct = merge(getInternalNodes(op), getExternalNodes(props));
    resolveDependencies(struct);
    this.props = props;
    this.structure = struct;
    this.db = db;
    // TODO: Provide a way to test reference for equality in order to keep the
    // comparison optimizations.
    this.keepReferences = keepReferences;
    this.serializers = serializers;
    this.computeOrder = resolveOrder(struct);
    this.cb = cb;
  }
  private compute() {
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
    if (this.destroyed) {
      return;
    }

    if (!props) {
      return;
    }

    const serializedProps = Object.keys(props).reduce((acc, x) => {
      const result = this.serializers.reduce((acc, y) => {
        if (y.type && y.type !== GraphNodeType.EXTERNAL) {
          return acc;
        }

        if (y.name && y.name !== x) {
          return acc;
        }

        let specificity = 1;
        if (y.type === GraphNodeType.EXTERNAL) {
          specificity += 1;
        }

        if (y.name === x) {
          specificity += 1;
        }
        if (y.instanceof && props[x] instanceof y.instanceof) {
          specificity += 1;
        }

        const value = y.serializer(props[x]);
        if (value === undefined) {
          return acc;
        }

        if (acc.specificity && acc.specificity > specificity) {
          return acc;
        }

        if (acc.specificity === specificity) {
          console.warn(
            "serializer conflict, deep equality will be used instead for",
            x
          );
          return {};
        }

        acc = {
          specificity,
          value,
        };

        return acc;
      }, {} as { specificity?: number; value?: any });

      if (result.value) {
        acc[x] = result.value;
      }

      return acc;
    }, {} as { [k: string]: any });

    const nonSerializedProps = Object.keys(props).reduce((acc, x) => {
      if (!serializedProps[x]) {
        acc[x] = props[x];
      }
      return acc;
    }, {} as { [k: string]: any });

    // console.log("---");
    // console.log(props);
    // console.log(serializedProps, this.serializedProps);
    // console.log(nonSerializedProps, this.nonSerializedProps);

    if (
      isEqual(serializedProps, this.serializedProps) &&
      isEqual(nonSerializedProps, this.nonSerializedProps)
    ) {
      // console.log("NOT passed");
      return;
    }

    // console.log("passed");

    // Serializers should be order by specificity
    // The most specific serializer is one that targets type and name
    // matchers

    // If the serialization fails then the value is ignored from the serialization
    // check and a later deep equality is done

    // serialize what props can be serialized
    // test to see if these are the same
    // then deeply test all other values

    this.serializedProps = serializedProps;
    this.nonSerializedProps = nonSerializedProps;

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

  private update() {
    if (this.destroyed) {
      return;
    }
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

    const currentData = data;
    if (isEqual(this.prevData, data)) {
      return;
    }
    this.prevData = currentData;
    this.cb.call(null, data);
  }

  destroy() {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
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
