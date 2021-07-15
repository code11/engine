import type * as Babel from "@babel/core";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvxyz", 10);

export const addNamedImport = (
  babel: typeof Babel,
  program: Babel.NodePath<Babel.types.Program>,
  moduleName: string,
  exportName: string
): string => {
  const t = babel.types;
  const path = program.get("body").find((p) => {
    const result =
      p.isImportDeclaration() && p.node.source.value.indexOf(moduleName) !== -1;
    return result;
  });

  let alias; // `${exportName}Engine`;
  if (!path) {
    alias = nanoid();
    const newNode = t.importDeclaration(
      [t.importSpecifier(t.identifier(alias), t.identifier(exportName))],
      t.stringLiteral(moduleName)
    );
    const body = program.get("body.0");
    //@ts-ignore
    body.insertBefore(newNode);
  } else if (t.isImportDeclaration(path)) {
    const node = path.node as Babel.types.ImportDeclaration;
    const exportedVariable = node.specifiers.find((x) => {
      if (t.isImportSpecifier(x)) {
        if (
          (t.isIdentifier(x.imported) && x.imported.name === exportName) ||
          (t.isStringLiteral(x.imported) && x.imported.value === exportName)
        ) {
          return true;
        }
      }
      return false;
    });
    if (!exportedVariable) {
      alias = nanoid();
      node.specifiers.push(
        t.importSpecifier(t.identifier(alias), t.identifier(exportName))
      );
    } else {
      alias = exportedVariable.local.name;
    }
  } else {
    throw new Error("unknown situation encounted when generating view import");
  }

  return alias;
};
