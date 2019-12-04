import * as Babel from '@babel/core';
import { parseRef } from './parseRef';
import { structOperationCompiler, paramsCompiler } from '../compilers';
import {
  CallExpression,
  ArrowFunctionExpression,
  objectExpression,
  objectProperty,
  identifier,
  importDeclaration,
  importSpecifier,
  stringLiteral
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

  const engineImport = importDeclaration(
    [importSpecifier(identifier('producer'), identifier('producer'))],
    stringLiteral('@c11/engine')
  );

  const macroImport = ref
    .findParent(p => p.isProgram())
    .get('body')
    .find(p => {
      const result =
        p.isImportDeclaration() &&
        p.node.source.value.indexOf('@c11/engine.macro') !== -1;
      return result;
    });

  if (macroImport) {
    macroImport.insertAfter(engineImport);
  } else {
    throw new Error('Could not find macro import');
  }
};
