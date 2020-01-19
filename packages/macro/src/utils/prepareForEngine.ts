import * as Babel from "@babel/core";
import { parseRef } from "./parseRef";
import { getConfig } from "./getConfig";
import { structOperationCompiler, paramsCompiler } from "../compilers";
import {
  CallExpression,
  ArrowFunctionExpression,
  objectExpression,
  objectProperty,
  identifier,
  importDeclaration,
  importSpecifier,
  stringLiteral,
} from "@babel/types";
import { validateRef } from "./validateRef";

export enum TransformType {
  PRODUCER = "PRODUCER",
  VIEW = "VIEW",
}
type PrepareForEngine = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath,
  type: TransformType
) => void;

export const prepareForEngine: PrepareForEngine = (babel, state, ref, type) => {
  const validation = validateRef(ref);
  if (validation.error) {
    throw new Error(validation.errorMessage);
  }

  const config = getConfig(state);

  const op = parseRef(babel, state, ref);
  const args = structOperationCompiler(op);
  const node = ref.parentPath.node as CallExpression;
  const fn = node.arguments[0] as ArrowFunctionExpression;

  fn.params = [paramsCompiler(op)];
  const result = objectExpression([
    objectProperty(identifier("args"), args),
    objectProperty(identifier("fn"), fn),
  ]);

  if (type === TransformType.PRODUCER) {
    ref.parentPath.replaceWith(result);
  } else if (type === TransformType.VIEW) {
    node.arguments[0] = result;
    const viewImport = config.view.importFrom;
    const engineImport = importDeclaration(
      [importSpecifier(identifier("view"), identifier("view"))],
      stringLiteral(viewImport)
    );

    const macroImport = ref
      .findParent(p => p.isProgram())
      .get("body")
      .find(p => {
        const result =
          p.isImportDeclaration() &&
          p.node.source.value.indexOf("@c11/engine.macro") !== -1;
        return result;
      });

    if (macroImport) {
      macroImport.insertAfter(engineImport);
    } else {
      throw new Error("Could not find macro import");
    }
  }
};
