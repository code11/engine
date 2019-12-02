import * as Babel from '@babel/core';
import {
  CallExpression,
  ArrowFunctionExpression,
  ObjectPattern
} from '@babel/types';

type ProcessReference = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => void;

import { validateRef } from './validateRef';
import { processStruct } from './processStruct';

export const processReference: ProcessReference = (
  { types: t },
  state,
  ref
) => {
  const result = validateRef(t, ref);
  if (result.error) {
    throw new Error(result.errorMessage);
  }
  const node = ref.parentPath.node as CallExpression;
  const fn = node.arguments[0] as ArrowFunctionExpression;
  const rawArgs = fn.params[0] as ObjectPattern;
  const body = fn.body;

  const struct = processStruct(t, rawArgs);

  console.log('result', struct);
};
