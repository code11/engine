import * as Babel from '@babel/core';
import {
  CallExpression,
  ArrowFunctionExpression,
  ObjectPattern
} from '@babel/types';
import { structParser } from './structParser';
import { StructOperation } from '../../lib/producer/types';

type ReferenceParser = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => StructOperation;

export const referenceParser: ReferenceParser = (babel, state, ref) => {
  const node = ref.parentPath.node as CallExpression;
  const fn = node.arguments[0] as ArrowFunctionExpression;
  const rawArgs = fn.params[0] as ObjectPattern;

  const result = structParser(rawArgs);
  return result;
};
