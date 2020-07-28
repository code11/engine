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
    "should support Merge": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = Merge.foo,
          a2 = Merge[Prop.foo],
          a3 = Merge[Arg.a2],
          a4 = Merge.foo[Prop.bar.baz],
          a5 = Merge.foo.bar[Arg.a2],
          a6 = {
            baz: Merge.foo[Arg.a4].baz,
          },
          a7 = Merge.foo[Prop.a5.baz],
          a8 = Merge.foo[Param.prop],
          a9 = Merge.foo[Param.prop].baz,
          a10 = Merge.foo[Param.prop].baz[Prop.a2]
        }) => { }
      `,
      snapshot: true,
    },
  },
});
