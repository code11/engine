import type * as Babel from "@babel/core";

export const addHotModuleAccept = (
  babel: typeof Babel,
  program: Babel.NodePath<Babel.types.Program>
) => {
  const t = babel.types;
  const body = program.get("body");
  const last = body[body.length - 1];

  if (!last) {
    return;
  }

  const expr = t.memberExpression(
    t.memberExpression(t.identifier("module"), t.identifier("hot")),
    t.identifier("accept")
  );

  last.insertAfter(t.expressionStatement(t.callExpression(expr, [])));
};
