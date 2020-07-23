import * as Babel from "@babel/core";
import {
  CallExpression,
  ArrowFunctionExpression,
  ObjectPattern,
  AssignmentPattern,
} from "@babel/types";
import { StructOperation } from "@c11/engine.types";
import { paramsParser } from "../parsers";

type ParseRef = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => StructOperation;

export const parseRef: ParseRef = (babel, state, ref) => {
  const node = ref.parentPath.node as CallExpression;
  const fn = node.arguments[0] as ArrowFunctionExpression;
  const params = fn.params as AssignmentPattern[];
  const result = paramsParser(params);
  return result;
};
