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
    "should throw an error if it is not invoked": {
      code: `
        import { producer } from ${macroFile}
        const result = producer 
      `,
      error: true,
    },
    "should throw an error if it is not invoked with an arrow function": {
      code: `
        import { producer } from ${macroFile}
        const result = producer(({
          foo = '123'
        }))
      `,
      error: true,
    },
    "should throw an error if the parameter is not an function pattern": {
      code: `
        import { producer } from ${macroFile}
        const result = producer(({
          foo = '123'
        })) => foo)
      `,
      error: true,
    },
  },
});
