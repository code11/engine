import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "babel-plugin-macros";

// const macroFile = "'./build/macro/index.macro'";
const macroFile = "'@c11/engine.macro'";
const config = require("./babelConfig.json");

pluginTester({
  plugin,
  babelOptions: {
    filename: __filename,
    ...config,
  },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: "babel",
    });
  },
  tests: {
    "should keep values in paths": {
      only: true,
      code: `
        import { producer } from ${macroFile}
        const val = "321"
        const obj = {
          foo: {
            bar: "234"
          }
        }
        const a: producer = ({
          a1 = get.foo[123],
          a2 = get.foo[val],
          a3 = get.foo["val"].foo,
          a4 = get.foo[obj.foo.bar].baz,
          a5 = get.foo[prop.foo][Request.foo][param.bar].baz,
          a6 = get.foo[\`bam\${val}baz\`].foo,
        }) => {  }
      `,
      snapshot: true,
    },
  },
});
