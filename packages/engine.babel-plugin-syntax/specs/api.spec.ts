import pluginTester from "babel-plugin-tester";
import prettier from "prettier";
import plugin from "../src";

const config = require("./babelConfig.json");

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
    "should ignore other types": {
      code: `
        const result: foo = ({
          a1 = '123',
        }) => { }
      `,
      snapshot: true,
    },
    "should support arg": {
      code: `
        const result: producer = ({
          a1 = '123',
          a2 = arg.a1,
          a3 = arg.a2[arg.a1],
          a4 = arg.a3[prop.foo],
        }) => { }
      `,
      snapshot: true,
    },
    "should support prop": {
      code: `
        const result: producer = ({
          bam,
          foo = prop.foo,
          bar = prop.foo[prop.baz],
          baz = prop.foo[arg.bar][prop.baz]
        }) => { }
      `,
      snapshot: true,
    },
    "should support update": {
      code: `
        const result: producer = ({
          a1 = update.foo,
          a2 = update[prop.foo],
          a3 = update[arg.a2],
          a4 = update.foo[prop.bar.baz],
          a5 = update.foo.bar[arg.a2],
          a6 = {
            baz: update.foo[arg.a4].baz,
          },
          a7 = update.foo[prop.a5.baz],
          a8 = update.foo[param.prop],
          a9 = update.foo[param.prop].baz,
          a10 = update.foo[param.prop].baz[prop.a2]
        }) => { }
      `,
      snapshot: true,
    },
    "should keep values in paths": {
      code: `
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
    "should support wildcard": {
      code: `
        const foo: producer = ({
          id = wildcard,
          boo = observe.foo[arg.id].foo,
          bar = observe.foo[wildcard].bar
        }) => {}
      `,
      snapshot: true,
    },
    "should support observe": {
      code: `
        const result: producer = ({
          a1 = observe.foo,
          a2 = observe[prop.foo],
          a3 = observe[arg.a2],
          a4 = observe.foo[prop.bar.baz],
          a5 = observe.foo.bar[arg.a2],
          a6 = {
            baz: observe.foo[arg.a4].baz,
          }
        }) => { }
      `,
      snapshot: true,
    },
    "should support get": {
      code: `
        const result: producer = ({
          a1 = get.foo,
          a2 = get[prop.foo],
          a3 = get[arg.a2],
          a4 = get.foo[prop.bar.baz],
          a5 = get.foo.bar[arg.a2],
          a6 = {
            baz: get.foo[arg.a4].baz,
          },
          a7 = get.foo[arg.a5.baz],
          a8 = get.foo[param.prop],
          a9 = get.foo[param.prop].baz,
          a10 = get.foo[param.prop].baz[prop.a2]
        }) => { }
      `,
      snapshot: true,
    },
    "should support constructors": {
      code: `
      const result: producer = ({
        _get = get,
        _update = update,
        _observe = observe
      }) => { }`,
      snapshot: true,
    },
  },
});
