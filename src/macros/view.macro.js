// @ts-nocheck
const createMacro = require('babel-plugin-macros').createMacro

const webpackCommentImportMacros = ({ references, state, babel }) => {
  // lets walk through all calls of the macro
  references.default.map(referencePath => {
    // check if it is call expression e.g. someFunction("blah-blah")
    if (referencePath.parentPath.isCallExpression()) {
      // call our macro
      requireWebpackCommentImport({ referencePath, state, babel })
    } else {
      // fail otherwise
      throw new Error(
        `This is not supported: \`${referencePath
          .findParent(babel.types.isExpression)
          .getSource()}\`. Please see the webpack-comment-import.macro documentation`
      )
    }
  })
}

const collect = (expr, ar = []) => {
  if (expr.type === 'MemberExpression') {
    ar = [...collect(expr.object), (expr.property.name || expr.property.value)]
  } else {
    return [(expr.name || expr.value)]
  }
  return ar
}

const requireWebpackCommentImport = ({ referencePath, state, babel }) => {
  const t = babel.types
  const node = referencePath.parentPath.node
  const viewFunc = node.arguments[0]
  const params = node.arguments[0].params

  const args = []
  const fArguments = []

  params.forEach((a, i) => {
    if (a.type === 'AssignmentPattern') {
      const paramName = a.left
      const expression = a.right

      fArguments.push(t.objectProperty(paramName, paramName, false, true))

      if (t.isMemberExpression(expression)) {
        const ar = collect(expression)
        args.push(t.objectProperty(paramName, t.arrayExpression(ar.map(a => t.stringLiteral(a)))))
      }
    }
  })

  const macroImport = referencePath
    .findParent((p) => p.isProgram())
    .get("body")
    .find(p => p.isImportDeclaration() && p.node.source.value.indexOf("view.macro") !== -1)

  const viewImport = t.importDeclaration([t.importSpecifier(t.identifier('view'), t.identifier('view'))], t.stringLiteral('@c11/ui-engine'))
  macroImport.insertAfter(viewImport)

  viewFunc.params = [t.objectPattern(fArguments)]
  node.arguments[0] = t.objectExpression([
    t.objectProperty(t.identifier("args"), t.objectExpression(args)),
    t.objectProperty(t.identifier("fn"), viewFunc)
  ])

}

module.exports = createMacro(webpackCommentImportMacros)
