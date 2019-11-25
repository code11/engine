const t = require("@babel/types")
const DEFAULT_CONFIG = {
  view: {
    local: 'view',
    imported: 'view',
    engine: '@c11/engine',
  },
  provider: {
    local: 'provider',
    imported: 'provider',
    engine: '@c11/engine',
  }

}
const createMacroOrig = require('babel-plugin-macros').createMacro
module.exports.createMacro = (importHandler) => {
  return createMacroOrig(webpackCommentImportMacros(importHandler))
}

const webpackCommentImportMacros = (importHandler) => ({ references, state, babel }) => {
  const config = {
    ...DEFAULT_CONFIG,
    ...(require(state.cwd + '/package.json')['@c11'] || {})
  }
  // lets walk through all calls of the macro
  references.default.map(referencePath => {
    // check if it is call expression e.g. someFunction("blah-blah")
    if (referencePath.parentPath.isCallExpression()) {
      // call our macro
      importHandler({ referencePath, state, babel, config })
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

module.exports.getMacroImport = (referencePath, name) => referencePath
  .findParent(p => p.isProgram())
  .get('body')
  .find(
    p =>
      p.isImportDeclaration() &&
      p.node.source.value.indexOf(name + '.macro') !== -1
  )

module.exports.macroReplaceImport = ({local, imported, engine}) => t.importDeclaration(
  [
    t.importSpecifier(
      t.identifier(local),
      t.identifier(imported)
    )
  ],
  t.stringLiteral(engine)
)

module.exports.parseExpression = localArgs => path => {
  if (t.isMemberExpression(path.node.left)) {
    localArgs.push(collect(path.node.left))
    path.node.left = t.identifier('param' + (localArgs.length - 1))
  }
  if (t.isMemberExpression(path.node.right)) {
    localArgs.push(collect(path.node.right))
    path.node.right = t.identifier('param' + (localArgs.length - 1))
  }
}

const collect = module.exports.collect = (expr, ar = []) => {
  if (expr.type === 'MemberExpression') {
    ar = [...collect(expr.object), expr.property.name || expr.property.value]
  } else {
    return [expr.name || expr.value]
  }
  return ar
}

