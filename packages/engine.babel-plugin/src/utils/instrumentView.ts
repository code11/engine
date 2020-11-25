import type * as Babel from "@babel/core";
import { EngineKeywords } from "@c11/engine.types";
import { paramParser } from "../parsers";
import { structOperationCompiler, paramsCompiler } from "../compilers";
import { Messages } from "../messages";
import { addNamedImport } from "./addNamedImport";
import { PluginConfig } from "../plugin";
import { extractMeta } from "./extractMeta";
import { rawObjectCompiler } from "../compilers/rawObjectCompiler";

export const instrumentView = (
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

  if (!config.viewLibrary) {
    throw path.buildCodeFrameError(`Configuration error. Add a view library to you babel config, example:
"plugins": ["@c11/engine.babel-plugin", { "viewLibrary": "@c11/engine.react" }]
    `);
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

  fn.params = paramsCompiler(babel, parsedParam);
  const props = structOperationCompiler(babel, parsedParam);
  const meta = rawObjectCompiler(babel, metaProps);

  const result = t.objectExpression([
    t.objectProperty(t.identifier("props"), props),
    t.objectProperty(t.identifier("meta"), meta),
    t.objectProperty(t.identifier("fn"), fn),
  ]);

  const program = path.findParent((p) =>
    p.isProgram()
  ) as Babel.NodePath<Babel.types.Program>;
  const alias = addNamedImport(
    babel,
    program,
    config.viewLibrary,
    EngineKeywords.VIEW
  );

  node.init = t.callExpression(t.identifier(alias), [result]);
};
