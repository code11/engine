import * as Babel from "@babel/core";
import { callExpression } from "@babel/types";
import { EngineKeywords } from "@c11/engine.types";
import { Messages } from "../messages";
import { PluginConfig } from "../plugin";
import { instrumentProducer, instrumentView } from "../utils";

export const VariableDeclaratorVisitor = (
  babel: typeof Babel,
  state: PluginConfig
) => (path: Babel.NodePath<Babel.types.VariableDeclarator>) => {
  const t = babel.types
  const id = path.node.id;
  if (
    !(t.isIdentifier(id) || t.isObjectPattern(id)) ||
    !t.isTSTypeAnnotation(id.typeAnnotation) ||
    !t.isTSTypeReference(id.typeAnnotation.typeAnnotation) ||
    !t.isIdentifier(id.typeAnnotation.typeAnnotation.typeName) ||
    !(
      id.typeAnnotation.typeAnnotation.typeName.name === EngineKeywords.VIEW ||
      id.typeAnnotation.typeAnnotation.typeName.name === EngineKeywords.PRODUCER
    )
  ) {
    return;
  }

  if (t.isObjectPattern(id)) {
    throw path.buildCodeFrameError(Messages.INVALID_USAGE)
  }

  const keyword = id.typeAnnotation.typeAnnotation.typeName.name;
  if (keyword === EngineKeywords.PRODUCER) {
    instrumentProducer(babel, state, path);
  } else if (keyword === EngineKeywords.VIEW) {
    instrumentView(babel, state, path);
  }

  // The node was transformed so the type annotation
  // can be removed
  //@ts-ignore
  path.node.id = t.identifier(path.node.id.name)
};
