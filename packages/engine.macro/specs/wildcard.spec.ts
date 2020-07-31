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
    "should support Wildcard": {
      code: `
        import { Wildcard, view } from ${macroFile};
        const foo: view = ({
          id = Wildcard,
          boo = Observe.foo[Arg.id].foo,
          bar = Observe.foo[Wildcard].bar
        }) => {}
      `,
      snapshot: true,
    },
  },
});
