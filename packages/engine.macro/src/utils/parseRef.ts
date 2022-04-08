import * as Babel from "@babel/core";
import {
  CallExpression,
  ArrowFunctionExpression,
  ObjectPattern,
  AssignmentPattern,
  VariableDeclarator,
} from "@babel/types";
import { StructOperation } from "@c11/engine.types";
import { paramsParser } from "../parsers";

type ParseRef = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => StructOperation;

export const parseRef: ParseRef = (babel, state, ref) => {
  const parent = ref.findParent((p) => p.isVariableDeclarator());
  if (!parent) {
    throw new Error(
      "Misuse of the view/producer keyword. It needs to be a variable declaration e.g. let foo: view = ..."
    );
  }

  const declaration = parent.node as VariableDeclarator;
  const fn = declaration.init as ArrowFunctionExpression;
  const params = fn.params[0] as ObjectPattern;
  const result = paramsParser(params);
  return result;
};
