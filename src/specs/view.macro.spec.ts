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
import React from 'react'
import view from '../../view.macro'
import ReactDom from 'react-dom'
export default view((
  isOpen = Get.notificationsPopup.visible,
  openPopUp = Set.currentPopup,
  t = Get.utils.i18n
) => {
  console.log('Icon render', isOpen, openPopUp)
  return !isOpen && "HTML"
})`,
      output: `
import React from "react";
import { view } from "@c11/engine";
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
});`
    },
    'can parse default value': {
      code: `
import React from 'react'
import view from '../../view.macro'
import ReactDom from 'react-dom'
export default view((
  isOpen = Get.notificationsPopup.visible || false
) => {})
    `,
      output: `
import React from "react";
import { view } from "@c11/engine";
import ReactDom from "react-dom";
export default view({
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
    'handles complex expressions': {
      code: `
import React from 'react'
import view from '../../view.macro'
import ReactDom from 'react-dom'
export default view((
  isOpen = Get.foo && (Get.bar.baz < 7) || 'foobar'
) => {})
    `,
      output: `
import React from "react";
import { view } from "@c11/engine";
import ReactDom from "react-dom";
export default view({
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
    },
    "static values": {
      code: `
import view from '../../view.macro'
export default view((
  foo = 'bar',
  justAProp
) => {})`
      ,
      output: `
import { view } from "@c11/engine";
export default view({
  args: {
    foo: "bar",
    justAProp: ["Prop", "justAProp"]
  },
  fn: ({ foo, justAProp }) => {}
});`
    }
  }
})

export {}
