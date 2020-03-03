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
    "should support Prop": {
      code: `
        import { producer } from ${macroFile}
        const result = producer((
          foo,
          bar = Prop.bar
        ) => { })
      `,
      snapshot: true,
    },
  },
});