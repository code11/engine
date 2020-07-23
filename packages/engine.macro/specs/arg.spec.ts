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
    "should support Arg": {
      code: `
        import { producer } from ${macroFile}
        const result = producer((
          a1 = '123',
          a2 = Arg.a1,
          a3 = Arg.a2[Arg.a1],
          a4 = Arg.a3[Prop.foo],
        ) => { })
      `,
      snapshot: true,
    },
  },
});
