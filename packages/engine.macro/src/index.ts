import { ProducerConfig } from "@c11/engine.types";
import { createMacro, MacroHandler } from "babel-plugin-macros";
import { ReactElement } from "react";
import { addPathImport } from "./utils/addPathImport";
import { addWildcardImport } from "./utils/addWildcardImport";
import { prepareForEngine, TransformType } from "./utils/prepareForEngine";

/**
 * TODO: Verify which args are used by the function and eliminate
 * unnecessary ones
 */

const EngineMacroHandler:MacroHandler = ({ 
  references, 
  state, 
  babel, 
  // @ts-ignore
  config 
}) => {
  const { Wildcard = [], Path = [], view = [], producer = [] } = references;
  state.config = config
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
type ViewSomething = {
  producers: ProducerConfig[];
};

type ViewElement<T> = ReactElement<T> & ViewSomething;

export type producer<T = any> = (props: T) => void;
export type view<T = any> = (props: T) => ViewElement<T> | null;

export const Observe: any = {};
export const Update: any = {};
export const Get: any = {};
export const Arg: any = {};
export const Prop: any = {};
export const Param: any = {};
export const Path: any = {};
export const Wildcard: any = {};

const macro = createMacro(EngineMacroHandler, {
  configName: "engine",
});
export default macro;
