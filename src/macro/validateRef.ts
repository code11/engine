import * as Babel from '@babel/core';

interface Result {
  success?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export const validateRef = (
  t: typeof Babel.types,
  ref: Babel.NodePath
): Result => {
  const result: Result = {
    error: true
  };
  const node = ref.parentPath.node;
  if (!t.isCallExpression(node)) {
    result.errorMessage = `\`${name}\` should be used as a function. Please see the engine.macro documentation`;
  } else if (node.arguments.length !== 1) {
    result.errorMessage = `\`${name}\` should have only one argument`;
  } else {
    const instance = node.arguments[0];
    if (!t.isArrowFunctionExpression(instance)) {
      result.errorMessage = `\`${name}\` supports only arrow functions`;
    } else if (instance.params.length > 1) {
      result.errorMessage = `\`${name}\` the arrow function should have only one parameter`;
    } else if (!t.isObjectPattern(instance.params[0])) {
      result.errorMessage = `\`${name}\` the parameter should be an object pattern`;
    } else {
      result.error = false;
      result.success = true;
    }
  }
  return result;
};
