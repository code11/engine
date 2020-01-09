import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "babel-plugin-macros";

const macroFile = "'@c11/engine.macro'";

pluginTester({
  plugin,
  babelOptions: { filename: __filename },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: "babel",
    });
  },
  tests: {
    "should support Get": {
      code: `
        import { producer } from ${macroFile}
        producer(({
          a1 = Get.foo,
          a2 = Get['@foo'],
          a3 = Get['$a2'],
          a4 = Get.foo['@bar.baz'],
          a5 = Get.foo.bar['$a2'],
          a6 = {
            baz: Get.foo['$a4'].baz,
          },
          a7 = Get.foo['$a5.baz']
        }) => { })
      `,
      snapshot: true,
    },
  },
});
