import type * as Babel from "@babel/core";
import {
  EngineKeywords,
  OperationTypes,
  PassthroughOperation,
} from "@c11/engine.types";
import { paramParser } from "../parsers";
import {
  passthroughOperationCompiler,
  structOperationCompiler,
  paramsCompiler,
} from "../compilers";
import { Messages } from "../messages";
import { addNamedImport } from "./addNamedImport";
import { PluginConfig } from "../plugin";
import { extractMeta } from "./extractMeta";
import { rawObjectCompiler } from "../compilers/rawObjectCompiler";
import { randomId } from "@c11/engine.utils";
import { InstrumentationOutput } from "../types";

export const instrumentView = (
  babel: typeof Babel,
  config: PluginConfig,
  state: Babel.PluginPass,
  path: Babel.NodePath<Babel.types.VariableDeclarator>
): InstrumentationOutput => {
  const t = babel.types;
  const node = path.node;

  if (!t.isArrowFunctionExpression(node.init)) {
    throw path.buildCodeFrameError(Messages.ARROW_FUNCTION_EXPECTED);
  }

  if (!config.viewLibrary) {
    throw path.buildCodeFrameError(`Configuration error. Add a view library to you babel config, example:
"plugins": ["@c11/engine.babel-plugin-syntax", { "viewLibrary": "@c11/engine.react" }]
    `);
  }

  const fn = node.init as Babel.types.ArrowFunctionExpression;
  const param = fn.params[0];

  if (param && !(t.isObjectPattern(param) || t.isIdentifier(param))) {
    throw path.buildCodeFrameError(Messages.INVALID_FUNCTION_PARAM);
  }

  let props;
  let parsedParam;
  if (t.isObjectPattern(param)) {
    parsedParam = paramParser(babel, param);
    fn.params = paramsCompiler(babel, parsedParam);
    props = structOperationCompiler(babel, parsedParam);
  } else {
    parsedParam = {
      type: OperationTypes.PASSTHROUGH,
    } as PassthroughOperation;
    props = passthroughOperationCompiler(babel);
  }
  const metaProps = extractMeta(babel, state, path);
  const sourceId = `${metaProps.absoluteFilePath}:${metaProps.name}`;
  const buildId = randomId();
  const program = path.findParent((p) =>
    p.isProgram()
  ) as Babel.NodePath<Babel.types.Program>;
  const alias = addNamedImport(
    babel,
    program,
    config.viewLibrary,
    EngineKeywords.VIEW
  );

  const output: InstrumentationOutput = {
    type: EngineKeywords.VIEW,
    meta: metaProps,
    sourceId,
    buildId,
    params: parsedParam,
  };

  if (
    !(process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test")
  ) {
    const meta = rawObjectCompiler(babel, metaProps);
    const result = t.objectExpression([
      t.objectProperty(t.identifier("fn"), fn),
      t.objectProperty(t.identifier("props"), props),
      t.objectProperty(t.identifier("type"), t.stringLiteral("view")),
      t.objectProperty(t.identifier("meta"), meta),
      t.objectProperty(t.identifier("buildId"), t.stringLiteral(buildId)),
      t.objectProperty(t.identifier("buildAt"), t.numericLiteral(Date.now())),
      t.objectProperty(t.identifier("sourceId"), t.stringLiteral(sourceId)),
    ]);

    const configId = `__ENGINE_CONFIG__${metaProps.name}`;
    const declaration = path.find((x) => t.isVariableDeclaration(x));
    if (declaration) {
      const foo = t.variableDeclaration("const", [
        t.variableDeclarator(t.identifier(configId), result),
      ]);
      declaration.insertBefore(foo);
    }
    node.init = t.callExpression(t.identifier(alias), [t.identifier(configId)]);
  } else {
    const result = t.objectExpression([
      t.objectProperty(t.identifier("fn"), fn),
      t.objectProperty(t.identifier("props"), props),
      t.objectProperty(t.identifier("type"), t.stringLiteral("view")),
      t.objectProperty(t.identifier("buildId"), t.stringLiteral(buildId)),
    ]);
    node.init = t.callExpression(t.identifier(alias), [result]);
  }

  return output;
};
