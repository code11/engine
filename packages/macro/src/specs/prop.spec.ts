import pluginTester from 'babel-plugin-tester';
import prettier from 'prettier';
import plugin from 'babel-plugin-macros';

const macroFile = "'./build/macro/index.macro'";

pluginTester({
  plugin,
  babelOptions: { filename: __filename },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: 'babel'
    });
  },
  tests: {
    'should support Prop': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          foo = Prop['@foo'],
          bar = Prop['@foo.bar'],
          baz = Prop['@foo.bar'].baz
        }) => { })
      `,
      snapshot: true
    }
  }
});
