import { MacroProducerType, MacroViewType, ProducerConfig } from "@c11/engine.types";
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
  const { wildcard = [], path = [], view = [], producer = [] } = references;
  state.config = config
  view.forEach((x) => prepareForEngine(babel, state, x, TransformType.VIEW));
  producer.forEach((x) =>
    prepareForEngine(babel, state, x, TransformType.PRODUCER)
  );
  if (path.length > 0) {
    path.forEach((x) => {
      addPathImport(babel, state, x);
    });
  }
  if (wildcard.length > 0) {
    wildcard.forEach((x) => {
      addWildcardImport(babel, state, x);
    });
  }
}

interface Config {
  [k: string]: any;
}

export type producer = MacroProducerType
export type view<T=any> = MacroViewType<T>

export const observe: any = {};
export const update: any = {};
export const get: any = {};
export const arg: any = {};
export const prop: any = {};
export const param: any = {};
export const path: any = {};
export const wildcard: any = {};

const macro = createMacro(EngineMacroHandler, {
  configName: "engine",
});
export default macro;
