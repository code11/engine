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
    result = result.replace(
      /buildId:\s?\"[a-zA-Z_]+\"/g,
      `buildId:"unique_id"`
    );
    return prettier.format(result, {
      parser: "babel",
    });
  },
  pluginName: "engine.babel-plugin-syntax",
  tests: {
    "should compile a producer": {
      code: `
      const foo: producer = ({ foo = observe.foo }) => {}
      `,
      snapshot: true,
    },
    "should support simple prop params": {
      code: `
        const foo: producer = ({ prop }) => {}
      `,
      snapshot: true,
    },
    "should support props arguments for passthrough": {
      code: `
        const foo: producer = (props) => {}
      `,
      snapshot: true,
    },
    "should throw if not given an arrow function": {
      code: `const foo: producer = 123`,
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
