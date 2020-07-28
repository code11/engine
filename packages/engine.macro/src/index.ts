import { createMacro } from "babel-plugin-macros";
import * as Babel from "@babel/core";
import { prepareForEngine, TransformType } from "./utils/prepareForEngine";
import { replacePath } from "./utils/replacePath";

type References = Babel.NodePath[];

interface MacroParams {
  references: {
    view?: References;
    producer?: References;
    Path?: References;
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
  const { Path = [], view = [], producer = [] } = references;
  view.forEach((x) => prepareForEngine(babel, state, x, TransformType.VIEW));
  producer.forEach((x) =>
    prepareForEngine(babel, state, x, TransformType.PRODUCER)
  );
  Path.forEach((x) => {
    replacePath(babel, state, x);
  });
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

const macro = createMacro(myMacro);
export default macro;
