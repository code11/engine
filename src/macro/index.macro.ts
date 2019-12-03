import { createMacro } from 'babel-plugin-macros';
import * as Babel from '@babel/core';
import { processReference } from './processReference';

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

/**
 * TODO: Verify which args are used by the function and eliminate
 * unnecessary ones
 */

function myMacro({ references, state, babel }: MacroParams) {
  const { view = [], producer = [] } = references;
  view.forEach(x => processReference(babel, state, x));
  producer.forEach(x => processReference(babel, state, x));
}

export default createMacro(myMacro);
