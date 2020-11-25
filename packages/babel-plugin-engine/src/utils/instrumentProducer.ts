import type * as Babel from "@babel/core";
import { paramParser } from "../parsers";
import { structOperationCompiler, paramsCompiler } from "../compilers";
import { Messages } from "../messages";
import { PluginConfig } from "../plugin";
import { extractMeta } from "./extractMeta";
import { rawObjectCompiler } from "../compilers/rawObjectCompiler";

export const instrumentProducer = (
  babel: typeof Babel,
  config: PluginConfig,
  state: Babel.PluginPass,
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
  let metaProps = {};
  if (process.env.NODE_ENV === "development") {
    metaProps = extractMeta(babel, state, path);
  }

  const props = structOperationCompiler(babel, parsedParam);
  const meta = rawObjectCompiler(babel, metaProps);
  fn.params = paramsCompiler(babel, parsedParam);

  const result = t.objectExpression([
    t.objectProperty(t.identifier("props"), props),
    t.objectProperty(t.identifier("meta"), meta),
    t.objectProperty(t.identifier("fn"), fn),
  ]);

  node.init = result;
};
