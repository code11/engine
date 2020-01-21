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
    "should support Set": {
      code: `
        import { producer } from ${macroFile}
        const result = producer((
          a1 = Set.foo,
          a2 = Set[Prop.foo],
          a3 = Set[Arg.a2],
          a4 = Set.foo[Arg.bar.baz],
          a5 = Set.foo.bar[Arg.a2],
          a6 = {
            baz: Set.foo[Arg.a4].baz,
          },
          a7 = Set.foo[Arg.a5.baz],
          a8 = Set.foo[Param.prop],
          a9 = Set.foo[Param.prop].baz,
          a10 = Set.foo[Param.prop.a].baz[Prop.a2]
        ) => { })
      `,
      snapshot: true,
    },
  },
});
