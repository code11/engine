import pluginTester from 'babel-plugin-tester';
import prettier from 'prettier';
import plugin from 'babel-plugin-macros';

const macroFile = "'./macro/macro/index.macro'";

pluginTester({
  plugin,
  babelOptions: { filename: __filename },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: 'babel'
    });
  },
  tests: {
    'should throw an error if it is not invoked': {
      code: `
        import { producer } from ${macroFile}
        const a = producer 
      `,
      error: true
    },
    'should throw an error if it is not invoked with an arrow function': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          foo= '123'
        }))
      `,
      error: true
    },
    'should throw an error if it is the arrow function is invoked with multiple params': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          foo = '123'
        }, {
          bar = '123'
        }) => foo)
      `,
      error: true
    },
    'should throw an error if the parameter is not an object pattern': {
      code: `
        import { producer } from ${macroFile}
        producer((
          foo = '123'
        )) => foo)
      `,
      error: true
    },
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
    },
    'should support Get': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          a1 = Get.foo,
          a2 = Get['@foo'],
          a3 = Get['$a2'],
          a4 = Get.foo['@bar.baz'],
          a5 = Get.foo.bar['$a2'],
          a6 = {
            baz: Get.foo['$a4'].baz,
          },
          a7 = Get.foo['$a5.baz']
        }) => { })
      `,
      snapshot: true
    },
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
    },
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
    },
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
    },
    'should keep Constants': {
      only: true,
      code: `
        import { producer } from ${macroFile}
        producer(({
          a1 = '123',
          a2 = {
            foo: 123
          },
          a3 = function () { return false },
          a4 = () => {},
          a5 = /123/,
          a6 = null,
          a7 = undefined,
        }) => { })
      `,
      snapshot: true
    },
    'should support composed types: functions': {
      code: `
        import { producer } from ${macroFile}
        producer(({
          a1 = Get.foo || '123' && '123'
        }) => { })
      `,
      snapshot: true
    }
  }
});
