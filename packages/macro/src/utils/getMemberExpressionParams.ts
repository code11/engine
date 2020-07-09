import {
  Node,
  StringLiteral,
  Identifier,
  NumberLiteral,
  BooleanLiteral,
} from "@babel/types";
import { PathArgs } from "@c11/engine-types";

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
        throw new Error("Not support path argument" + result);
      }
      return [...getMemberExpressionParams(node.object), pathArg];
    } else {
      // TODO: Figure out how to access .name or .value depending on property
      return [
        ...getMemberExpressionParams(node.object),
        (node.property as any).name || (node.property as any).value,
      ];
    }
  } else if (node.hasOwnProperty("value")) {
    return [(node as ValueNodes).value];
  } else if (node.hasOwnProperty("name")) {
    return [(node as Identifier).name];
  } else {
    console.log("is different");
    return [];
  }
};
