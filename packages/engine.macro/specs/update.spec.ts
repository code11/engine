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
    "should support update": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = update.foo,
          a2 = update[prop.foo],
          a3 = update[arg.a2],
          a4 = update.foo[prop.bar.baz],
          a5 = update.foo.bar[arg.a2],
          a6 = {
            baz: update.foo[arg.a4].baz,
          },
          a7 = update.foo[prop.a5.baz],
          a8 = update.foo[param.prop],
          a9 = update.foo[param.prop].baz,
          a10 = update.foo[param.prop].baz[prop.a2]
        }) => { }
      `,
      snapshot: true,
    },
  },
});
