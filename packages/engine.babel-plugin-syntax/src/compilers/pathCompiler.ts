import { InvokablePath, ValueTypes } from "@c11/engine.types";
import type * as Babel from "@babel/core";
import type { ArrayExpression } from "@babel/types";

export const pathCompiler = (
  babel: typeof Babel,
  path: InvokablePath
): ArrayExpression => {
  const t = babel.types;
  const parts = path.map((x) => {
    let type = t.objectProperty(t.identifier("type"), t.stringLiteral(x.type));
    let value = t.objectProperty(t.identifier("ignored"), t.nullLiteral());
    if (x.type === ValueTypes.CONST) {
      let paramValue;
      if (x.value.__node__) {
        paramValue = x.value.__node__;
      } else {
        paramValue = t.stringLiteral(x.value.toString());
      }
      value = t.objectProperty(t.identifier("value"), paramValue);
    } else if (
      x.type === ValueTypes.INTERNAL ||
      x.type === ValueTypes.EXTERNAL
    ) {
      const path = x.path.map((y: string) => t.stringLiteral(y));
      value = t.objectProperty(t.identifier("path"), t.arrayExpression(path));
    } else if (x.type === ValueTypes.INVOKE) {
      const path = x.path.map((y: string) => t.stringLiteral(y));
      value = t.objectProperty(t.identifier("path"), t.arrayExpression(path));
    } else if (x.type === ValueTypes.REFINEE) {
      const type = t.objectProperty(
        t.identifier("type"),
        t.stringLiteral(x.value.type)
      );
      const args = t.objectProperty(
        t.identifier("args"),
        t.arrayExpression(
          x.value.args.map((x) => {
            const type = t.objectProperty(
              t.identifier("type"),
              t.stringLiteral(x.type)
            );
            let value;
            if (x.type === ValueTypes.CONST) {
              value = t.objectProperty(t.identifier("value"), x.value);
            } else {
              value = t.objectProperty(
                t.identifier("path"),
                t.arrayExpression(x.path.map((y: string) => t.stringLiteral(y)))
              );
            }
            return t.objectExpression([type, value]);
          })
        )
      );
      value = t.objectProperty(
        t.identifier("value"),
        t.objectExpression([type, args])
      );
    }
    return t.objectExpression([type, value]);
  });
  const result = t.arrayExpression(parts);
  return result;
};
