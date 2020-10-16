import * as Babel from "@babel/core";
import {
  isMemberExpression,
  importDeclaration,
  importSpecifier,
  identifier,
  stringLiteral,
} from "@babel/types";

type AddPathImport = (
  babel: typeof Babel,
  state: any,
  ref: Babel.NodePath
) => void;

export const addPathImport: AddPathImport = (babel, state, ref) => {
  const producerName = "@c11/engine.producer";
  const pathImport = importDeclaration(
    [importSpecifier(identifier("Path"), identifier("Path"))],
    stringLiteral(producerName)
  );

  const program = ref.findParent((p) => p.isProgram());

  if (!program) {
    throw new Error("Internal error. Cannot find program node");
  }

  const macroImport = program.get("body").find((p) => {
    const result =
      p.isImportDeclaration() &&
      p.node.source.value.indexOf("@c11/engine.macro") !== -1;
    return result;
  });

  if (macroImport) {
    macroImport.insertAfter(pathImport);
  }
};
