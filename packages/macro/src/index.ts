import { createMacro } from "babel-plugin-macros";
import * as Babel from "@babel/core";
import { prepareForEngine, TransformType } from "./utils/prepareForEngine";
import { ViewConfig } from "@c11/engine-types";

type References = Babel.NodePath[];

interface MacroParams {
  references: {
    view?: References,
    producer?: References,
    default: References,
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
  view.forEach(x => prepareForEngine(babel, state, x, TransformType.VIEW));
  producer.forEach(x =>
    prepareForEngine(babel, state, x, TransformType.PRODUCER)
  );
}

interface GenericMacroArgs {
  args: any
  fn: () => any
}

export declare type producer = (config: GenericMacroArgs) => any;
export declare type view = (config: GenericMacroArgs) => React.ComponentClass;

const macro = createMacro(myMacro);
export default macro;
