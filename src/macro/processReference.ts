import * as Babel from '@babel/core';
import {
  CallExpression,
  ArrowFunctionExpression,
  ObjectPattern,
  objectExpression,
  objectProperty,
  identifier
} from '@babel/types';
import { paramsCompiler, structOperationCompiler } from './compile';
import { validateRef } from './validateRef';
import { processStruct } from './processStruct';

type ProcessReference = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => void;

export const processReference: ProcessReference = (babel, state, ref) => {
  const result = validateRef(ref);
  if (result.error) {
    throw new Error(result.errorMessage);
  }
  const node = ref.parentPath.node as CallExpression;
  const fn = node.arguments[0] as ArrowFunctionExpression;
  const rawArgs = fn.params[0] as ObjectPattern;
  const body = fn.body;

  const struct = processStruct(rawArgs);
  const args = structOperationCompiler(struct);

  fn.params = [paramsCompiler(struct)];
  node.arguments[0] = objectExpression([
    objectProperty(identifier('args'), args),
    objectProperty(identifier('fn'), fn)
  ]);
};
