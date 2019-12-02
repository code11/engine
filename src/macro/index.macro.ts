import { createMacro } from 'babel-plugin-macros';
import * as Babel from '@babel/core';
import { processReference } from './processReference';

enum PathSymbols {
  EXTERNAL = '@',
  INTERNAL = '$',
  INVOKABLE = ':'
}

enum PathTypes {
  GET = 'Get',
  SET = 'Set',
  MERGE = 'Merge',
  REF = 'Ref'
}

enum AssignmentType {
  PATHTYPE = 'PATHTYPE',
  COMPOSITION = 'COMPOSITION',
  STRUCTURE = 'STRUCTURE'
}

const getAssignmentType = (): AssignmentType => {
  return AssignmentType.PATHTYPE;
};

// export as engine.macro

// Func, struct and value are implicit

// external: @
// internal: \$
// invokable: :

// Walk through all the calls of the macro
// Check if the call is valid
// Get the data structure
// Process the structure recursively
// Each node can be either:
// a) identifier
// This would be equivalent to GET['@prop']
// b) assignmentPattern
// - process assignment pattern:
// - - a) a PathType
// - - b) a composition
// - - c) new structure
//
// Create the final structure
// Replace the macro arguments with the final structure
// Insert the producer/view import
type References = Babel.NodePath[];

interface MacroParams {
  references: {
    view?: References;
    producer?: References;
    default: References;
  };
  state: any;
  babel: typeof Babel;
}

function myMacro({ references, state, babel }: MacroParams) {
  const { view = [], producer = [] } = references;
  view.forEach(x => processReference(babel, state, x));
  producer.forEach(x => processReference(babel, state, x));
}

export default createMacro(myMacro);
