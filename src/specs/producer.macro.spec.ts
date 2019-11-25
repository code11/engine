const pluginTester = require('babel-plugin-tester').default
const prettier = require('prettier')
const plugin = require('babel-plugin-macros')

pluginTester({
  plugin,
  snapshot: false,
  babelOptions: {
    filename: __filename
  },
  formatResult: (result: any) => {
    return prettier.format(result, {
      parser: 'babel'
    })
  },
  tests: {
    'does not change this': '\n\nexport const State = initialState;\n\n',
    'does not change this2': 'module.exports.State = intiailState;',
    'transforms defaults to arrays': {
      code: `
  import producer from '../../producer.macro'
  export default producer((
    isOpen = Get.notificationsPopup.visible,
    openPopUp = Set.currentPopup,
    t = Get.utils.i18n
  ) => {})`,
      output: `
  import { producer } from "@c11/engine";
  export default producer({
    args: {
      isOpen: ["Get", "notificationsPopup", "visible"],
      openPopUp: ["Set", "currentPopup"],
      t: ["Get", "utils", "i18n"]
    },
    fn: ({ isOpen, openPopUp, t }) => {}
  });`
    },
    'can parse default value': {
      code: `
  import producer from '../../producer.macro'
  export default producer((
    isOpen = Get.notificationsPopup.visible || false
  ) => {})
      `,
      output: `
  import { producer } from "@c11/engine";
  export default producer({
    args: {
      isOpen: [
        "Func",
        {
          args: [["Get", "notificationsPopup", "visible"]],
          fn: param0 => {
            return param0 || false;
          }
        }
      ]
    },
    fn: ({ isOpen }) => {}
  });
      `
    },
    'can parse binary exprssion': {
      code: `
  import producer from '../../producer.macro'
  export default producer((
    isOpen = Get.notificationsPopup.visible === true
  ) => {})
      `,
      output: `
  import { producer } from "@c11/engine";
  export default producer({
    args: {
      isOpen: [
        "Func",
        {
          args: [["Get", "notificationsPopup", "visible"]],
          fn: param0 => {
            return param0 === true;
          }
        }
      ]
    },
    fn: ({ isOpen }) => {}
  });
      `
    },
    'handles complex expressions': {
      code: `
  import producer from '../../producer.macro'
  export default producer((
    isOpen = Get.foo && (Get.bar.baz < 7) || 'foobar'
  ) => {})
      `,
      output: `
  import { producer } from "@c11/engine";
  export default producer({
    args: {
      isOpen: [
        "Func",
        {
          args: [
            ["Get", "bar", "baz"],
            ["Get", "foo"]
          ],
          fn: (param0, param1) => {
            return (param1 && param0 < 7) || "foobar";
          }
        }
      ]
    },
    fn: ({ isOpen }) => {}
  });
      `
    }
  }
})

export {}
