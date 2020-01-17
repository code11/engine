import { createMacro } from "babel-plugin-macros";
import * as Babel from "@babel/core";
import { prepareForEngine, TransformType } from "./utils/prepareForEngine";

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
  view.forEach(x => prepareForEngine(babel, state, x, TransformType.VIEW));
  producer.forEach(x =>
    prepareForEngine(babel, state, x, TransformType.PRODUCER)
  );
}

type ProducerConfig = (args: Map<String, any>) => any;
type ViewConfig = (args: Map<string, any>) => JSX.Element;

type producer = (config: ProducerConfig) => any;
type view = (config: ViewConfig) => JSX.Element;

export const producer: producer = config => null;
export const view: view = config => {
  return {} as JSX.Element;
};

const macro = createMacro(myMacro);
export default macro;
