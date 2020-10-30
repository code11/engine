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
    "should support path": {
      code: `
        import { path, view } from ${macroFile};
        const a = path.foo.bar
        const b = path
        const foo: view = ({
          value = path.bar,
          doo = a.bam,
          boo = observe.foo[arg.value][arg.doo],
          moo = observe[b]
        }) => {}
      `,
      snapshot: true,
    },
  },
});
