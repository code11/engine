import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "babel-plugin-macros";

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
    "should support wildcard": {
      code: `
        import { wildcard, view } from ${macroFile};
        const foo: view = ({
          id = wildcard,
          boo = observe.foo[arg.id].foo,
          bar = observe.foo[wildcard].bar
        }) => {}
      `,
      snapshot: true,
    },
  },
});
