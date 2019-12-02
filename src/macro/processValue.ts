import { ObjectProperty, isAssignmentPattern } from '@babel/types';
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
  StaticValue
} from '../lib/producer/types';
import { getMemberExpressionParams } from './getMemberExpressionParams';
import { PathType } from './types';
import { processInvokablePathValue } from './processInvokablePathValue';
import { processStruct } from './processStruct';
import { processPropPathValue } from './processPropPathValue';

const constValue = (value: any): ValueOperation => {
  console.log('Assigning constant value', value);
  return {
    type: OperationTypes.VALUE,
    value: {
      type: ValueTypes.CONST,
      value: value
    }
  };
};

interface Values {
  [key: string]: (node: any) => Operation | undefined;
}

const Values: Values = {
  StringLiteral: node => constValue({ __node__: node }),
  NumberLiteral: node => constValue({ __node__: node }),
  BooleanLiteral: node => constValue({ __node__: node }),
  NumericLiteral: node => constValue({ __node__: node }),
  ArrowFunctionExpression: node => constValue({ __node__: node }),
  // ObjectExpression: node => constValue(node.value)
  // foo = Get.foo.bar
  MemberExpression: node => {
    const params = getMemberExpressionParams(node);
    const op = params[0] as PathType;
    const rawPath = params.slice(1);
    const path: InvokableValue[] = processInvokablePathValue(rawPath);

    // TODO: Is path valid? e.g. get operations with invoke

    if (op === PathType.GET) {
      return {
        type: OperationTypes.GET,
        path
      } as GetOperation;
    } else if (op === PathType.SET) {
      return {
        type: OperationTypes.SET,
        path
      } as SetOperation;
    } else if (op === PathType.MERGE) {
      return {
        type: OperationTypes.MERGE,
        path
      } as MergeOperation;
    } else if (op === PathType.REF) {
      return {
        type: OperationTypes.REF,
        path
      } as RefOperation;
    } else if (op === PathType.PROP) {
      return {
        type: OperationTypes.VALUE,
        value: processPropPathValue(rawPath)
      } as ValueOperation;
    } else {
      return undefined;
    }
  },
  // foo = Get.foo || Get.bar
  LogicalExpression: node => {
    return constValue('123');
  },
  // foo = Get.foo ? true : false
  ConditionalExpression: node => {
    return constValue('123');
  },
  BinaryExpression: node => {
    return constValue('123');
  },
  ObjectExpression: node => {
    const value = processStruct(node);
    return value as StructOperation;
  }
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
    throw new Error(`${valueNode && valueNode.type} not supported as a value`);
  }
};
