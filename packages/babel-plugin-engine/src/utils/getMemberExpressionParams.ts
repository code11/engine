import type * as Babel from "@babel/core";
import { PathArgs } from "@c11/engine.types";

type ValueNodes =
  | Babel.types.StringLiteral
  | Babel.types.NumericLiteral
  | Babel.types.BooleanLiteral;

export const getMemberExpressionParams = (
  babel: typeof Babel,
  node: Babel.types.Node
): any[] => {
  const t = babel.types;
  if (t.isMemberExpression(node)) {
    if (t.isMemberExpression(node.property)) {
      let result = getMemberExpressionParams(babel, node.property.object);
      if (node.property.property) {
        const params = getMemberExpressionParams(babel, node.property.property);
        result = result.concat(params);
      }
      let pathArg;
      if (result[0] === PathArgs.EXTERNAL) {
        result.shift();
        pathArg = "@" + result.join(".");
      } else if (result[0] === PathArgs.INTERNAL) {
        result.shift();
        pathArg = "$" + result.join(".");
      } else if (result[0] === PathArgs.PARAM) {
        result.shift();
        pathArg = ":" + result.join(".");
      } else {
        pathArg = {
          __node__: node.property,
        };
      }
      return [...getMemberExpressionParams(babel, node.object), pathArg];
    } else {
      let value;
      if (t.isIdentifier(node.property) && node.computed) {
        value = { __node__: node.property };
      } else if (t.isTemplateLiteral(node.property)) {
        value = { __node__: node.property };
      } else {
        value = (node.property as any).name || (node.property as any).value;
      }

      return [...getMemberExpressionParams(babel, node.object), value];
    }
  } else if (node.hasOwnProperty("value")) {
    return [(node as ValueNodes).value];
  } else if (node.hasOwnProperty("name")) {
    return [(node as Babel.types.Identifier).name];
  } else {
    return [];
  }
};
