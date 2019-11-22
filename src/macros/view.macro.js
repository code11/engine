// @ts-nocheck
const DEFAULT_CONFIG = {
  importEngine: '@c11/engine',
  importName: 'view',
  importAs: 'view'
}
const createMacro = require('babel-plugin-macros').createMacro

const webpackCommentImportMacros = ({ references, state, babel }) => {
  const config = {
    ...DEFAULT_CONFIG,
    ...(require(state.cwd + '/package.json')['@c11'] || {})
  }
  // lets walk through all calls of the macro
  references.default.map(referencePath => {
    // check if it is call expression e.g. someFunction("blah-blah")
    if (referencePath.parentPath.isCallExpression()) {
      // call our macro
      requireWebpackCommentImport({ referencePath, state, babel, config })
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
    ar = [...collect(expr.object), expr.property.name || expr.property.value]
  } else {
    return [expr.name || expr.value]
  }
  return ar
}

const parseExpression = (t, localArgs) => path => {
  if (t.isMemberExpression(path.node.left)) {
    localArgs.push(collect(path.node.left))
    path.node.left = t.identifier('param' + (localArgs.length - 1))
  }
  if (t.isMemberExpression(path.node.right)) {
    localArgs.push(collect(path.node.right))
    path.node.right = t.identifier('param' + (localArgs.length - 1))
  }
}

const requireWebpackCommentImport = ({
  referencePath,
  state,
  babel,
  config
}) => {
  const t = babel.types
  const node = referencePath.parentPath.node
  const viewFunc = node.arguments[0]
  const params = node.arguments[0].params

  const args = []
  const fArguments = []

  params.forEach((a, i) => {
    if (a.type === 'AssignmentPattern') {
      const paramName = a.left
      const paramPath = referencePath.parentPath.get(`arguments.0.params.${i}`)

      fArguments.push(t.objectProperty(paramName, paramName, false, true))

      if (t.isMemberExpression(a.right)) {
        const ar = collect(a.right)
        args.push(
          t.objectProperty(
            paramName,
            t.arrayExpression(ar.map(a => t.stringLiteral(a)))
          )
        )
      } else if (t.isLogicalExpression(a.right)) {
        const localArgs = []
        const visitor = parseExpression(t, localArgs)
        paramPath.traverse({
          BinaryExpression: { exit: visitor },
          LogicalExpression: { exit: visitor }
        })

        const innerParams = localArgs.map((_, i) => t.identifier('param' + i))
        args.push(
          t.objectProperty(
            paramName,
            t.arrayExpression([
              t.stringLiteral('Func'),
              t.objectExpression([
                t.objectProperty(t.identifier('args'), t.arrayExpression(localArgs.map(a => t.arrayExpression(a.map(a => t.stringLiteral(a)))))),
                t.objectProperty(t.identifier('fn'), t.arrowFunctionExpression(innerParams, t.blockStatement([
                  t.returnStatement(paramPath.node.right)
                ])))
              ])
            ])
          )
        )
      }
    }
  })

  const macroImport = referencePath
    .findParent(p => p.isProgram())
    .get('body')
    .find(
      p =>
        p.isImportDeclaration() &&
        p.node.source.value.indexOf('view.macro') !== -1
    )

  const viewImport = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier(config.importName),
        t.identifier(config.importAs)
      )
    ],
    t.stringLiteral(config.importEngine)
  )
  macroImport.insertAfter(viewImport)

  viewFunc.params = [t.objectPattern(fArguments)]
  node.arguments[0] = t.objectExpression([
    t.objectProperty(t.identifier('args'), t.objectExpression(args)),
    t.objectProperty(t.identifier('fn'), viewFunc)
  ])
}

module.exports = createMacro(webpackCommentImportMacros)
