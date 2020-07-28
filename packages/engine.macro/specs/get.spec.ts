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
    "should support Get": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = Get.foo,
          a2 = Get[Prop.foo],
          a3 = Get[Arg.a2],
          a4 = Get.foo[Prop.bar.baz],
          a5 = Get.foo.bar[Arg.a2],
          a6 = {
            baz: Get.foo[Arg.a4].baz,
          },
          a7 = Get.foo[Arg.a5.baz],
          a8 = Get.foo[Param.prop],
          a9 = Get.foo[Param.prop].baz,
          a10 = Get.foo[Param.prop].baz[Prop.a2]
        }) => { }
      `,
      snapshot: true,
    },
  },
});
