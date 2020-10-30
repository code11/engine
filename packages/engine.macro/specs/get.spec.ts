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
    "should support get": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = get.foo,
          a2 = get[prop.foo],
          a3 = get[arg.a2],
          a4 = get.foo[prop.bar.baz],
          a5 = get.foo.bar[arg.a2],
          a6 = {
            baz: get.foo[arg.a4].baz,
          },
          a7 = get.foo[arg.a5.baz],
          a8 = get.foo[param.prop],
          a9 = get.foo[param.prop].baz,
          a10 = get.foo[param.prop].baz[prop.a2]
        }) => { }
      `,
      snapshot: true,
    },
  },
});
