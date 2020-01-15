import { createMacro } from "babel-plugin-macros";
import * as Babel from "@babel/core";
import { prepareForEngine, TransformType } from "./utils/prepareForEngine";
import React from "react";

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

// TODO: Figure out which view engine is used from the project's package.json

function myMacro({ references, state, babel }: MacroParams) {
  const { view = [], producer = [] } = references;
  view.forEach(x => prepareForEngine(babel, state, x, TransformType.VIEW));
  producer.forEach(x =>
    prepareForEngine(babel, state, x, TransformType.PRODUCER)
  );
}

type GenericMacro = (args: any) => any;

export declare type producer = (config: GenericMacro) => any;
export declare type view = (config: GenericMacro) => JSX.Element;

// export const producer: producer = args => null;
// export const view: view = args => 

const macro = createMacro(myMacro);
export default macro;
