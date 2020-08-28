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
    "should support Path": {
      code: `
        import { Path, view } from ${macroFile};
        const a = Path.foo.bar
        const b = Path
        const foo: view = ({
          value = Path.bar,
          doo = a.bam,
          boo = Observe.foo[Arg.value][Arg.doo],
          moo = Observe[b]
        }) => {}
      `,
      snapshot: true,
    },
  },
});
