import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "babel-plugin-macros";

// const macroFile = "'./build/macro/index.macro'";
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
    "should keep Constants": {
      only: true,
      code: `
        import { view } from ${macroFile}
        const a = view(({
          a1 = '123',
          a2 = {
            foo: 123
          },
          a3 = function () { return false },
          a4 = () => {},
          a5 = /123/,
          a6 = null,
          a7 = undefined,
        }) => {  })
      `,
      snapshot: true,
    },
  },
});
