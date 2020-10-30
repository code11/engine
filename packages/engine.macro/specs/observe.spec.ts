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
    "should support observe": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = observe.foo,
          a2 = observe[prop.foo],
          a3 = observe[arg.a2],
          a4 = observe.foo[prop.bar.baz],
          a5 = observe.foo.bar[arg.a2],
          a6 = {
            baz: observe.foo[arg.a4].baz,
          }
        }) => { }
      `,
      snapshot: true,
    },
  },
});
