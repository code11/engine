import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "babel-plugin-macros";

// const macroFile = "'./build/macro/index.macro'";
const macroFile = "'@c11/engine.macro'";
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
    "should keep Constants": {
      only: true,
      code: `
        import { view } from ${macroFile}
        const a: view = ({
          foo = get.foo
        }) => {  }
        const b: view = ({
          foo = get.foo
        }) => {  }
      `,
      snapshot: true,
    },
  },
});
