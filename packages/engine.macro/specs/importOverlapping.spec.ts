import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "babel-plugin-macros";

const macroFile = "'@c11/engine.macro'";
const engineReactFile = "'@c11/engine-view'";
const config = require("./babelConfig.json");

pluginTester({
  plugin,
  babelOptions: { filename: __filename, ...config },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: "babel",
    });
  },
  tests: {
    "should check overlapping import": {
      code: `
        import { view } from ${macroFile}
        import { Engine, foo } from ${engineReactFile}
        console.log('foo:',foo)
        const app:view=({})=>{}
      `,
      snapshot: true,
    },
  },
});
