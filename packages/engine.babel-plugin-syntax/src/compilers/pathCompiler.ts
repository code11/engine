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
      const method = t.objectProperty(
        t.identifier("method"),
        t.stringLiteral(x.value.method)
      );
      const args = t.objectProperty(
        t.identifier("args"),
        t.stringLiteral("wip")
        // t.arrayExpression(x.value.args)
      );
      value = t.objectProperty(
        t.identifier("value"),
        t.objectExpression([method, args])
      );
    }
    return t.objectExpression([type, value]);
  });
  const result = t.arrayExpression(parts);
  return result;
};
