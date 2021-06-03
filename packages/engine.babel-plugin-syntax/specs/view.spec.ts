import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "../src";

const config = require("./babelConfig.json");

// Add tests regarding let foo: producer = () => {}, bar: producer = () => {}

// Test invalid syntax with const foo: view = 123

pluginTester({
  plugin,
  babelOptions: { filename: __filename, ...config },
  pluginOptions: {
    viewLibrary: "engineViewLibrary",
  },
  pluginName: "babel-plugin-engine",
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: "babel",
    });
  },
  tests: {
    "should compile a view": {
      code: `
      const foo: view = ({ foo = observe.foo }) => {}
      `,
      snapshot: true,
    },
    "should add the import statement only once": {
      code: `
      const foo: view = ({ foo = observe.foo }) => { }
      const bar: view = ({ foo = observe.foo }) => { }
      `,
      snapshot: true,
    },
    "should throw if not given an arrow function": {
      code: `const foo: view = 123`,
      error: true,
    },
    "should throw if the variable declaration is an object pattern": {
      code: `const { foo }: view = () => {}`,
      error: true,
    },
    "should support empty arguments": {
      code: `
        const foo: view = () => {}
      `,
      snapshot: true,
    },
    "should support simple prop params": {
      code: `
        const foo: view = ({ prop }) => {}
      `,
      snapshot: true,
    },
    "should support props arguments for passthrough": {
      code: `
        const foo: view = (props) => {}
      `,
      snapshot: true,
    },
  },
});
