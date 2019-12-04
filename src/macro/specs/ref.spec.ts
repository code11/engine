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
    'should support Ref': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          a1 = Ref.foo,
          a2 = Ref['@foo'],
          a3 = Ref['$a2'],
          a4 = Ref.foo['@bar.baz'],
          a5 = Ref.foo.bar['$a2'],
          a6 = {
            baz: Ref.foo['$a4'].baz,
          },
          a7 = Ref.foo['$a5.baz'],
          a8 = Ref.foo[':prop'],
          a9 = Ref.foo[':prop'].baz,
          a10 = Ref.foo[':prop'].baz['@a2']
        }) => { })
      `,
      snapshot: true
    }
  }
});
