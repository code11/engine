import * as Babel from "@babel/core";
import {
  isArrowFunctionExpression,
  isTSTypeReference,
  VariableDeclaration,
  isTypeAnnotation,
  VariableDeclarator,
  isObjectPattern,
  Identifier,
} from "@babel/types";

interface Result {
  success?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export const validateRef = (ref: Babel.NodePath): Result => {
  const result: Result = {
    error: true,
  };
  if (!ref) {
    return result;
  }
  const node = ref.parentPath?.node;
  const refNode = ref.node as Identifier;
  const parent = ref.findParent((p) => p.isVariableDeclarator());
  if (!parent) {
    throw new Error(
      "The producer or view types can only be used with variable declarations e.g. let foo: producer."
    );
  }
  const declaration = parent.node as VariableDeclarator;
  if (!(isTSTypeReference(node) || isTypeAnnotation(node))) {
    result.errorMessage = `\`${refNode.name}\` should be used as a type. Please see the engine documentation`;
  } else if (!isArrowFunctionExpression(declaration.init)) {
    result.errorMessage = `\`${refNode.name}\` should receive an arrow function expression. Please see the engine documentation`;
  } else if (
    declaration.init.params.length > 0 &&
    !isObjectPattern(declaration.init.params[0])
  ) {
    result.errorMessage = `\`${refNode.name}\` should receive a single argument which needs to be an object`;
  } else {
    result.error = false;
    result.success = true;
  }

  return result;
};
