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
    "should support Observe": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = Observe.foo,
          a2 = Observe[Prop.foo],
          a3 = Observe[Arg.a2],
          a4 = Observe.foo[Prop.bar.baz],
          a5 = Observe.foo.bar[Arg.a2],
          a6 = {
            baz: Observe.foo[Arg.a4].baz,
          }
        }) => { }
      `,
      snapshot: true,
    },
  },
});
