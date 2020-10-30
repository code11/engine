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
    "should support arg": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = '123',
          a2 = arg.a1,
          a3 = arg.a2[arg.a1],
          a4 = arg.a3[prop.foo],
        }) => { }
      `,
      snapshot: true,
    },
  },
});
