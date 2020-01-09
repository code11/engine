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
    'should support Set': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          a1 = Set.foo,
          a2 = Set['@foo'],
          a3 = Set['$a2'],
          a4 = Set.foo['@bar.baz'],
          a5 = Set.foo.bar['$a2'],
          a6 = {
            baz: Set.foo['$a4'].baz,
          },
          a7 = Set.foo['$a5.baz'],
          a8 = Set.foo[':prop'],
          a9 = Set.foo[':prop'].baz,
          a10 = Set.foo[':prop'].baz['@a2']
        }) => { })
      `,
      snapshot: true
    }
  }
});
