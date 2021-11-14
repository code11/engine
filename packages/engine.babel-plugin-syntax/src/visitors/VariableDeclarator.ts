import type * as Babel from "@babel/core";
import { EngineKeywords } from "@c11/engine.types";
import { Messages } from "../messages";
import { PluginConfig } from "../plugin";
import { InstrumentationOutput } from "../types";
import { instrumentProducer, instrumentView } from "../utils";

export const VariableDeclaratorVisitor =
  (
    babel: typeof Babel,
    config: PluginConfig,
    done: (output: InstrumentationOutput) => void
  ) =>
  (
    path: Babel.NodePath<Babel.types.VariableDeclarator>,
    state: Babel.PluginPass
  ) => {
    const t = babel.types;
    const id = path.node.id;
    if (
      !(t.isIdentifier(id) || t.isObjectPattern(id)) ||
      !t.isTSTypeAnnotation(id.typeAnnotation) ||
      !t.isTSTypeReference(id.typeAnnotation.typeAnnotation) ||
      !t.isIdentifier(id.typeAnnotation.typeAnnotation.typeName) ||
      !(
        id.typeAnnotation.typeAnnotation.typeName.name ===
          EngineKeywords.VIEW ||
        id.typeAnnotation.typeAnnotation.typeName.name ===
          EngineKeywords.PRODUCER
      )
    ) {
      return;
    }

    if (t.isObjectPattern(id)) {
      throw path.buildCodeFrameError(Messages.INVALID_USAGE);
    }

    const keyword = id.typeAnnotation.typeAnnotation.typeName.name;
    let instrumentationOutput;
    if (keyword === EngineKeywords.PRODUCER) {
      instrumentationOutput = instrumentProducer(babel, config, state, path);
    } else if (keyword === EngineKeywords.VIEW) {
      instrumentationOutput = instrumentView(babel, config, state, path);
    }

    // console.log(JSON.stringify(output, null, " "));

    if (instrumentationOutput) {
      done(instrumentationOutput);
    }

    // TOOD: Figure out if keeping the type annotation is more
    // useful for hmr identifing

    // The node was transformed so the type annotation
    // can be removed
    //@ts-ignore
    path.node.id = t.identifier(path.node.id.name);
  };
