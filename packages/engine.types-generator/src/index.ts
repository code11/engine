import * as Babel from "@babel/core";
import { parse, traverse, types as t } from "@babel/core";
import { EngineKeywords, StructOperation } from "@c11/engine.types";
import { paramParser } from "@c11/engine.babel-plugin-syntax";

//TODO: rename as @c11/engine.babel-engine-types

const compileParams = (params: StructOperation) => {
  /*
          import { State } from "somewhere"
          export type props = {
            foo = State["bam"]["boo"]
          }
          */
  // For Observe:
  // - take the path and produce the State... version
  // for VALUE is CONST:
  // Remember to process the STRUCT recursvely
  // The props need to be added right before or right after
  // the producer/view.
};

function bar() {
  const a = {
    foo: "s",
  };

  const b = ({ _a = a }: props) => {
    a;
  };
  type props = {
    _a: typeof a;
  };
}

export const typeGenerator = (code: string) => {
  const codes = `
    const foo = '123'
    const a: producer = ({
      _bam = bam,
      foo = observe.bam.boo[foo]
    }) => {}
  `;
  const result = parse(
    codes,
    { plugins: ["@babel/plugin-syntax-typescript"] },
    (err, ast) => {
      if (err) {
        throw err;
      }
      traverse(ast, {
        VariableDeclarator: (path) => {
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
            return;
          }

          const node = path.node;
          const fn = node.init as t.ArrowFunctionExpression;
          const param = fn.params[0];
          if (param && !t.isObjectPattern(param)) {
            return;
          }
          const parsedParams = paramParser(Babel, param);

          const result = compileParams(parsedParams);
          console.log("ok", JSON.stringify(parsedParams, null, " "));
        },
      });
    }
  );
};
