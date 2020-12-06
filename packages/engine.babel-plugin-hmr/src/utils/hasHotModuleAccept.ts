import type * as Babel from "@babel/core";

export const hasHotModuleAccept = (
  babel: typeof Babel,
  program: Babel.NodePath<Babel.types.Program>
): boolean => {
  const t = babel.types;
  let result = false;
  program.traverse({
    CallExpression: (path) => {
      const node = path.node;
      if (
        result ||
        !t.isCallExpression(node) ||
        !t.isMemberExpression(node.callee) ||
        !t.isMemberExpression(node.callee.object) ||
        !t.isIdentifier(node.callee.object.object) ||
        node.callee.object.object.name !== "module" ||
        !t.isIdentifier(node.callee.object.property) ||
        node.callee.object.property.name !== "hot" ||
        !t.isIdentifier(node.callee.property) ||
        node.callee.property.name !== "accept"
      ) {
        return;
      }
      result = true;
    },
  });
  return result;
};
