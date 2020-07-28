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
    "should support composed types: functions": {
      code: `
        import { producer } from ${macroFile}
        const result: producer = ({
          a1 = Get.foo || '123' && '123'
        }) => { }
      `,
      snapshot: true,
    },
  },
});
