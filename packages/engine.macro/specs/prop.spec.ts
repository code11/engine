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
    "should support Prop": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          foo = Prop.foo,
          bar = Prop.foo[Prop.baz],
          baz = Prop.foo[Arg.bar][Prop.baz]
        }) => { }
      `,
      snapshot: true,
    },
  },
});
