import { ValueTypes } from "@c11/engine.types";

export const parseOperation = (op) => {
  if (!op) {
    return [];
  }
  let result = [];

  if (op.path) {
    result = op.path.reduce(
      (acc, x) => {
        if (x.type === ValueTypes.CONST) {
          let name;
          const node = x.value.__node__;
          if (
            node?.type === "MemberExpression" &&
            node.object?.type === "Identifier" &&
            node.property?.type === "Identifier"
          ) {
            name = `[${node.object.name}.${node.property.name}]`;
          } else {
            name = x.value;
          }
          acc.push(name);
        } else {
          if (x.type === ValueTypes.INVOKE) {
            acc.push(`[param.${x.path.join(".")}]`);
          } else if (x.type === ValueTypes.EXTERNAL) {
            acc.push(`[prop.${x.path.join(".")}]`);
          } else if (x.type === ValueTypes.INTERNAL) {
            acc.push(`[arg.${x.path.join(".")}]`);
          } else {
            acc.push("[unknown]");
          }
        }
        return acc;
      },
      [op.type]
    );
  } else if (op.value) {
    if (op.value.type === ValueTypes.EXTERNAL) {
      result = ["prop"];
    } else if (op.value.type === ValueTypes.INTERNAL) {
      result = ["arg"];
    } else if (op.value.type === ValueTypes.INVOKE) {
      result = ["param"];
    } else if (op.value.type === ValueTypes.CONST) {
      if (op.value.value?.__node__?.name) {
        result = [op.value.value.__node__.name];
      } else {
        result = ["const"];
      }
    }
    result = result.concat(op.value.path);
  }
  return result;
};
