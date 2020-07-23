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
    "should support Ref": {
      code: `
        import { producer } from ${macroFile}
        const result = producer((
          a1 = Ref.foo,
          a2 = Ref[Prop.foo],
          a3 = Ref[Arg.a2],
          a4 = Ref.foo[Prop.bar.baz],
          a5 = Ref.foo.bar[Arg.a2],
          a6 = {
            baz: Ref.foo[Arg.a4].baz,
          },
          a7 = Ref.foo[Arg.a5.baz],
          a8 = Ref.foo[Param.prop],
          a9 = Ref.foo[Param.prop].baz,
          a10 = Ref.foo[Param.prop].baz[Prop.a2]
        ) => { })
      `,
      snapshot: true,
    },
  },
});
