import * as Babel from "@babel/core";
import { EngineKeywords } from "@c11/engine.types";
import { paramParser } from "../parsers";
import { structOperationCompiler, paramsCompiler } from "../compilers";
import { Messages } from "../messages";
import { addNamedImport } from "./addNamedImport";
import { PluginConfig } from "../plugin";
import { extractMeta } from "./extractMeta";

export const instrumentView = (
  babel: typeof Babel,
  state: PluginConfig,
  path: Babel.NodePath<Babel.types.VariableDeclarator>
) => {
  const t = babel.types;
  const node = path.node;

  if (!t.isArrowFunctionExpression(node.init)) {
    throw path.buildCodeFrameError(Messages.ARROW_FUNCTION_EXPECTED);
  }

  const fn = node.init as Babel.types.ArrowFunctionExpression;
  const param = fn.params[0];

  if (param && !t.isObjectPattern(param)) {
    throw path.buildCodeFrameError(Messages.INVALID_FUNCTION_PARAM);
  }

  const parsedParam = paramParser(babel, param);
  if (process.env.NODE_ENV !== "production") {
    parsedParam.meta = extractMeta(babel, path);
  }
  fn.params = paramsCompiler(babel, parsedParam);
  const args = structOperationCompiler(babel, parsedParam);
  const result = t.objectExpression([
    t.objectProperty(t.identifier("args"), args),
    t.objectProperty(t.identifier("fn"), fn),
  ]);

  const program = path.findParent((p) => p.isProgram()) as Babel.NodePath<
    Babel.types.Program
  >;
  const alias = addNamedImport(
    babel,
    program,
    state.viewLibrary,
    EngineKeywords.VIEW
  );

  node.init = t.callExpression(t.identifier(alias), [result]);


};
