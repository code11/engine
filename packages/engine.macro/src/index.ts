import { createMacro } from "babel-plugin-macros";
import * as Babel from "@babel/core";
import { prepareForEngine, TransformType } from "./utils/prepareForEngine";
import { addPathImport } from "./utils/addPathImport";
import { addWildcardImport } from "./utils/addWildcardImport";

type References = Babel.NodePath[];

interface MacroParams {
  references: {
    view?: References;
    producer?: References;
    Path?: References;
    Wildcard?: References;
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
  const { Wildcard = [], Path = [], view = [], producer = [] } = references;
  view.forEach((x) => prepareForEngine(babel, state, x, TransformType.VIEW));
  producer.forEach((x) =>
    prepareForEngine(babel, state, x, TransformType.PRODUCER)
  );
  if (Path.length > 0) {
    Path.forEach((x) => {
      addPathImport(babel, state, x);
    });
  }
  if (Wildcard.length > 0) {
    Wildcard.forEach((x) => {
      addWildcardImport(babel, state, x);
    });
  }
}

interface Config {
  [k: string]: any;
}

export type producer = any;
export type view = any;

export const Observe: any = {};
export const Update: any = {};
export const Get: any = {};
export const Arg: any = {};
export const Prop: any = {};
export const Param: any = {};
export const Path: any = {};
export const Wildcard: any = {};

const macro = createMacro(myMacro);
export default macro;
