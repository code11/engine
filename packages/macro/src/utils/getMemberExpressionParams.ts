import {
  Node,
  StringLiteral,
  Identifier,
  NumberLiteral,
  BooleanLiteral,
} from "@babel/types";

type ValueNodes = StringLiteral | NumberLiteral | BooleanLiteral;

export const getMemberExpressionParams = (node: Node): any[] => {
  if (node.type === "MemberExpression") {
    return [
      ...getMemberExpressionParams(node.object),
      node.property.name || node.property.value,
    ];
  } else if (node.hasOwnProperty("value")) {
    return [(node as ValueNodes).value];
  } else if (node.hasOwnProperty("name")) {
    return [(node as Identifier).name];
  } else {
    return [];
  }
};
