const pluginTester = require("babel-plugin-tester").default
const prettier = require("prettier")
const plugin = require("babel-plugin-macros")

pluginTester({
  plugin,
  snapshot: false,
  babelOptions: {
    filename: __filename,
  },
  formatResult: (result: any) => {
    return prettier.format(result);
  },
  tests: {
    'does not change this': '\n\nexport const State = initialState;\n\n',
    'does not change this2': 'module.exports.State = intiailState;',
    'changes this code': {
      code: `
import React from 'react'
import view from '../macros/view.macro'
import ReactDom from 'react-dom'
export default view((
  isOpen = Get.notificationsPopup.visible,
  openPopUp = Set.currentPopup,
  t = Get.utils.i18n
) => {
  console.log('Icon render', isOpen, openPopUp)
  return !isOpen && "HTML"
})
    `,
      output: `
import React from "react";
import { view } from "@c11/ui-engine";
import ReactDom from "react-dom";
export default view({
  args: {
    isOpen: ["Get", "notificationsPopup", "visible"],
    openPopUp: ["Set", "currentPopup"],
    t: ["Get", "utils", "i18n"]
  },
  fn: ({ isOpen, openPopUp, t }) => {
    console.log("Icon render", isOpen, openPopUp);
    return !isOpen && "HTML";
  }
});
    `
    }
  }
})
