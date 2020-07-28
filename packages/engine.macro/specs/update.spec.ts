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
    "should support Update": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = Update.foo,
          a2 = Update[Prop.foo],
          a3 = Update[Arg.a2],
          a4 = Update.foo[Prop.bar.baz],
          a5 = Update.foo.bar[Arg.a2],
          a6 = {
            baz: Update.foo[Arg.a4].baz,
          },
          a7 = Update.foo[Prop.a5.baz],
          a8 = Update.foo[Param.prop],
          a9 = Update.foo[Param.prop].baz,
          a10 = Update.foo[Param.prop].baz[Prop.a2]
        }) => { }
      `,
      snapshot: true,
    },
  },
});
