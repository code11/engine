import * as Babel from '@babel/core';
import { parseRef } from './parseRef';
import { structOperationCompiler, paramsCompiler } from './compilers';
import {
  CallExpression,
  ArrowFunctionExpression,
  objectExpression,
  objectProperty,
  identifier
} from '@babel/types';
import { validateRef } from './validateRef';

type PrepareForEngine = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => void;

export const prepareForEngine: PrepareForEngine = (babel, state, ref) => {
  const validation = validateRef(ref);
  if (validation.error) {
    throw new Error(validation.errorMessage);
  }
  const op = parseRef(babel, state, ref);
  const args = structOperationCompiler(op);
  const node = ref.parentPath.node as CallExpression;
  const fn = node.arguments[0] as ArrowFunctionExpression;

  fn.params = [paramsCompiler(op)];
  node.arguments[0] = objectExpression([
    objectProperty(identifier('args'), args),
    objectProperty(identifier('fn'), fn)
  ]);
};
