import * as Babel from "@babel/core";
import { isMemberExpression } from "@babel/types";

type ReplacePath = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => void;

export const replacePath: ReplacePath = (babel, state, ref) => {
  const node = ref.parentPath.node;
  if (isMemberExpression(node)) {
    console.log("OK");
  } else {
    console.log("NOt ok", node);
  }
};
