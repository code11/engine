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
  SetOperation,
  MergeOperation,
  RefOperation,
  StructOperation,
  FuncOperation,
  StaticOperation,
  PathType,
} from "@c11/engine-types";
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

const logicalExpression = (node: LogicalExpression): FuncOperation => {
  const params: StaticOperation[] = [];
  let temp: any = node;
  while (temp.left) {
    temp = temp.left;

    if (!temp) {
      temp = false;
    } else {
      if (isMemberExpression(temp)) {
        const result = Values.MemberExpression(temp) as StaticOperation;
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
  [key: string]: (node: any) => Operation | undefined;
}

const Values: Values = {
  // foo = Get.foo.bar
  MemberExpression: node => {
    const params = getMemberExpressionParams(node);
    const op = params[0] as PathType;
    const rawPath = params.slice(1);
    const path: InvokableValue[] = invokablePathValueParser(rawPath);

    // TODO: Is path valid? e.g. get operations with invoke

    if (op === PathType.GET) {
      return {
        type: OperationTypes.GET,
        path,
      } as GetOperation;
    } else if (op === PathType.SET) {
      return {
        type: OperationTypes.SET,
        path,
      } as SetOperation;
    } else if (op === PathType.MERGE) {
      return {
        type: OperationTypes.MERGE,
        path,
      } as MergeOperation;
    } else if (op === PathType.REF) {
      return {
        type: OperationTypes.REF,
        path,
      } as RefOperation;
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
      return undefined;
    }
  },
  // foo = Get.foo || Get.bar
  LogicalExpression: node => {
    return logicalExpression(node);
  },
  // foo = Get.foo ? true : false
  ConditionalExpression: node => {
    return funcValue(node);
  },
  BinaryExpression: node => {
    return funcValue(node);
  },
  ObjectExpression: node => {
    const value = structParser(node);
    return value as StructOperation;
  },
};

export const processValue = (node: ObjectProperty): Operation | void => {
  let valueNode;
  if (isAssignmentPattern(node.value)) {
    valueNode = node.value.right;
  } else {
    valueNode = node.value;
  }

  if (valueNode && Values[valueNode.type]) {
    return Values[valueNode.type](valueNode);
  } else {
    return constValue({ __node__: valueNode });
  }
};

export const processParamValue = (
  node: AssignmentPattern
): Operation | void => {
  let valueNode;
  if (isAssignmentPattern(node)) {
    valueNode = node.right;
  } else {
    valueNode = node;
  }

  if (valueNode && Values[valueNode.type]) {
    return Values[valueNode.type](valueNode);
  } else {
    return constValue({ __node__: valueNode });
  }
};
