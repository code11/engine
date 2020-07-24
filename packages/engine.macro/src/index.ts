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

type ProducerConfig = (...args: any[]) => any;
type ViewConfig = (...args: any[]) => any;

type producer = (config: ProducerConfig) => any;
type view = (config: ViewConfig) => any;

export const producer: producer = (config) => null;
export const view: view = (config) => {
  return {} as JSX.Element;
};

export const Get: any = {};
export const Arg: any = {};
export const Prop: any = {};
export const Ref: any = {};
export const Set: any = {};
export const Merge: any = {};
export const Param: any = {};
export const Remove: any = {};
export const Path: any = {};

const macro = createMacro(myMacro);
export default macro;
