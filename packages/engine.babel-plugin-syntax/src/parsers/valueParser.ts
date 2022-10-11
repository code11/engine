import type * as Babel from "@babel/core";
import {
  ObjectProperty,
  LogicalExpression,
  AssignmentPattern,
  isIdentifier,
} from "@babel/types";
import {
  Operation,
  OperationTypes,
  ValueTypes,
  ValueOperation,
  InvokableValue,
  GetOperation,
  UpdateOperation,
  ObserveOperation,
  StructOperation,
  FuncOperation,
  StaticOperation,
  PathType,
  AccessMethods,
  UpdateMethods,
} from "@c11/engine.types";
import { getMemberExpressionParams } from "../utils/getMemberExpressionParams";
import { invokablePathValueParser } from "./invokablePathValueParser";
import { structParser } from "./structParser";

const constValue = (value: any): ValueOperation => {
  return {
    type: OperationTypes.VALUE,
    value: {
      type: ValueTypes.CONST,
      value: value,
    },
  };
};

const funcValue = (node: Node): FuncOperation => {
  return {
    type: OperationTypes.FUNC,
    value: {
      params: [],
      fn: () => {},
    },
  };
};

const logicalExpression = (
  babel: typeof Babel,
  node: LogicalExpression
): FuncOperation => {
  const t = babel.types;
  const params: StaticOperation[] = [];
  let temp: any = node;
  while (temp.left) {
    temp = temp.left;

    if (!temp) {
      temp = false;
    } else {
      if (t.isMemberExpression(temp)) {
        const result = Values.MemberExpression(babel, temp) as StaticOperation;
        if (result) {
          params.push(result);
        }
      } else {
        params.push({
          type: OperationTypes.VALUE,
          value: {
            type: ValueTypes.CONST,
            value: { __node__: temp },
          },
        });
      }
    }
  }
  // do right

  return {
    type: OperationTypes.FUNC,
    value: {
      params,
      fn: () => {},
    },
  };
};

interface Values {
  [key: string]: (babel: typeof Babel, node: any) => Operation | undefined;
}

const Values: Values = {
  // foo = get.foo.bar
  MemberExpression: (babel, node) => {
    const params = getMemberExpressionParams(babel, node);
    const op = params[0] as PathType;
    const rawPath = params.slice(1);
    const path: InvokableValue[] = invokablePathValueParser(rawPath);

    // TODO: Is path valid? e.g. get operations with invoke

    if (op === PathType.GET) {
      return {
        type: OperationTypes.GET,
        path,
      } as GetOperation;
    } else if (op === PathType.OBSERVE) {
      return {
        type: OperationTypes.OBSERVE,
        path,
      } as ObserveOperation;
    } else if (op === PathType.UPDATE) {
      return {
        type: OperationTypes.UPDATE,
        path,
      } as UpdateOperation;
    } else if (op === PathType.PROP) {
      return {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.EXTERNAL,
          path: rawPath,
        },
      } as ValueOperation;
    } else if (op === PathType.ARG) {
      return {
        type: OperationTypes.VALUE,
        value: {
          type: ValueTypes.INTERNAL,
          path: rawPath,
        },
      } as ValueOperation;
    } else {
      return constValue({ __node__: node });
    }
  },
  CallExpression: (babel, node: Babel.types.CallExpression) => {
    const result = Values.MemberExpression(babel, node.callee);

    if (
      result &&
      (result.type === OperationTypes.GET ||
        result.type === OperationTypes.OBSERVE ||
        result.type === OperationTypes.UPDATE) &&
      result.path.length > 0
    ) {
      const lastIdx = result.path.length - 1;
      const last = result.path[lastIdx];

      if (
        last.type !== ValueTypes.CONST ||
        (last.value && last.value.__node__)
      ) {
        throw new Error(`refining ${result.type} does not support expressions`);
      }

      //TODO: throw if it's not an approved keyword

      result.path[lastIdx] = {
        type: ValueTypes.REFINEE,
        value: {
          type: last.value,
          args: node.arguments.map((x) => {
            // TODO: process arguments properly -> could be arg, prop
            return {
              type: ValueTypes.CONST,
              value: x,
            };
          }),
        },
      };
    }
    return result;
  },
  // foo = get.foo || get.bar
  LogicalExpression: (babel, node) => {
    return logicalExpression(babel, node);
  },
  // foo = get.foo ? true : false
  ConditionalExpression: (babel, node) => {
    return funcValue(node);
  },
  BinaryExpression: (babel, node) => {
    return funcValue(node);
  },
  ObjectExpression: (babel, node) => {
    const value = structParser(babel, node);
    return value as StructOperation;
  },
};

export const processValue = (
  babel: typeof Babel,
  node: ObjectProperty
): Operation | void => {
  const t = babel.types;
  let valueNode;
  if (t.isAssignmentPattern(node.value)) {
    valueNode = node.value.right;
  } else {
    valueNode = node.value;
  }

  if (valueNode && Values[valueNode.type]) {
    return Values[valueNode.type](babel, valueNode);
  } else {
    return constValue({ __node__: valueNode });
  }
};

export const processParamValue = (
  babel: typeof Babel,
  node: Babel.types.AssignmentPattern
): Operation | void => {
  const t = babel.types;
  let valueNode;
  if (t.isAssignmentPattern(node)) {
    valueNode = node.right;
  } else {
    valueNode = node;
  }

  if (valueNode && Values[valueNode.type]) {
    return Values[valueNode.type](babel, valueNode);
  } else {
    if (
      isIdentifier(valueNode) &&
      (valueNode.name === PathType.GET ||
        valueNode.name === PathType.OBSERVE ||
        valueNode.name === PathType.UPDATE)
    ) {
      return {
        type: OperationTypes.CONSTRUCTOR,
        value: valueNode.name,
      };
    } else {
      return constValue({ __node__: valueNode });
    }
  }
};
