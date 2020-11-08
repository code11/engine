import * as Babel from "@babel/core";
import {
  ObjectProperty,
  isAssignmentPattern,
  LogicalExpression,
  isMemberExpression,
  AssignmentPattern,
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

const logicalExpression = (babel: typeof Babel, node: LogicalExpression): FuncOperation => {
  const t= babel.types
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

export const processValue = (babel: typeof Babel, node: ObjectProperty): Operation | void => {
  const t = babel.types
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
  const t = babel.types
  let valueNode;
  if (t.isAssignmentPattern(node)) {
    valueNode = node.right;
  } else {
    valueNode = node;
  }

  if (valueNode && Values[valueNode.type]) {
    return Values[valueNode.type](babel, valueNode);
  } else {
    return constValue({ __node__: valueNode });
  }
};
