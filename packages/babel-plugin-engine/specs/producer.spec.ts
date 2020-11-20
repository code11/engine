import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "../src";

const config = require("./babelConfig.json");

// Add tests regarding let foo: producer = () => {}, bar: producer = () => {}

// Test invalid syntax with const foo: view = 123

pluginTester({
  plugin,
  babelOptions: { filename: __filename, ...config },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: "babel",
    });
  },
  pluginName: "babel-plugin-engine",
  tests: {
    "should compile a producer": {
      code: `
      const foo: producer = ({ foo = observe.foo }) => {}
      `,
      snapshot: true,
    },
    "should throw if not given an arrow function": {
      code: `const foo: producer = 123`,
      error: true,
    },
    "should throw if not function param is not an object": {
      code: `const foo: producer = (foo) => {}`,
      error: true,
    },
    "should throw an error if it is not invoked with an arrow function": {
      code: `
        const result: producer = {
          foo = '123'
        }
      `,
      error: true,
    },
  },
});
