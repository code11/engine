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
    'should support Merge': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          a1 = Merge.foo,
          a2 = Merge['@foo'],
          a3 = Merge['$a2'],
          a4 = Merge.foo['@bar.baz'],
          a5 = Merge.foo.bar['$a2'],
          a6 = {
            baz: Merge.foo['$a4'].baz,
          },
          a7 = Merge.foo['$a5.baz'],
          a8 = Merge.foo[':prop'],
          a9 = Merge.foo[':prop'].baz,
          a10 = Merge.foo[':prop'].baz['@a2']
        }) => { })
      `,
      snapshot: true
    }
  }
});
