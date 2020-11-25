import {
  Node,
  StringLiteral,
  Identifier,
  NumberLiteral,
  BooleanLiteral,
  isIdentifier,
  isTemplateLiteral,
} from "@babel/types";
import { PathProps } from "@c11/engine.types";

type ValueNodes = StringLiteral | NumberLiteral | BooleanLiteral;

export const getMemberExpressionParams = (node: Node): any[] => {
  if (node.type === "MemberExpression") {
    if (node.property.type === "MemberExpression") {
      let result = getMemberExpressionParams(node.property.object);
      if (node.property.property) {
        const params = getMemberExpressionParams(node.property.property);
        result = result.concat(params);
      }
      let pathArg;
      if (result[0] === PathProps.EXTERNAL) {
        result.shift();
        pathArg = "@" + result.join(".");
      } else if (result[0] === PathProps.INTERNAL) {
        result.shift();
        pathArg = "$" + result.join(".");
      } else if (result[0] === PathProps.PARAM) {
        result.shift();
        pathArg = ":" + result.join(".");
      } else {
        pathArg = {
          __node__: node.property,
        };
      }
      return [...getMemberExpressionParams(node.object), pathArg];
    } else {
      let value;
      if (isIdentifier(node.property) && node.computed) {
        value = { __node__: node.property };
      } else if (isTemplateLiteral(node.property)) {
        value = { __node__: node.property };
      } else {
        value = (node.property as any).name || (node.property as any).value;
      }

      return [...getMemberExpressionParams(node.object), value];
    }
  } else if (node.hasOwnProperty("value")) {
    return [(node as ValueNodes).value];
  } else if (node.hasOwnProperty("name")) {
    return [(node as Identifier).name];
  } else {
    return [];
  }
};
