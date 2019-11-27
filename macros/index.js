const utils = require('./utils')
const t = require('@babel/types')

const transformParams = (params, referencePath, fArguments, args) => {
  params.forEach((a, i) => {
    if (t.isIdentifier(a)) {
      fArguments.push(t.objectProperty(a, a, false, true))
      args.push(t.objectProperty(a,
        t.arrayExpression([
          t.stringLiteral('Prop'),
          t.stringLiteral(a.name)
        ])
      ))
    } else if (t.isAssignmentPattern(a)) {
      const paramName = a.left
      fArguments.push(t.objectProperty(paramName, paramName, false, true))

      if (t.isMemberExpression(a.right)) {
        const ar = utils.collect(a.right)
        if (ar[0] === 'Get' || ar[0] === 'Set' || ar[0] === 'Ref' || ar[0] === 'Func') {
          args.push(
            t.objectProperty(
              paramName,
              t.arrayExpression(ar.map(a => t.stringLiteral(a)))
            )
          )
        } else {
          args.push(t.objectProperty(
            paramName,
            a.right
          ))
        }
      } else if (t.isLogicalExpression(a.right) || t.isBinaryExpression(a.right)) {
        const paramPath = referencePath.parentPath.get(`arguments.0.params.${i}`)
        const localArgs = []
        const visitor = utils.parseExpression(localArgs)
        paramPath.traverse({
          Expression: { exit: visitor }
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
      } else {
        args.push(t.objectProperty(
          paramName,
          a.right
        ))
      }
    }
  })
}

module.exports = (macroName) => {
  const requireWebpackCommentImport = ({
    referencePath,
    config
  }) => {
    const node = referencePath.parentPath.node
    const viewFunc = node.arguments[0]
    if (node.arguments[0].params.length === 1 && t.isObjectPattern(node.arguments[0].params[0])) {
      node.arguments[0].params = node.arguments[0].params[0].properties.map(prop => prop.value)
    }

    const args = []
    const fArguments = []
    transformParams(node.arguments[0].params, referencePath, fArguments, args)

    const macroImport = utils.getMacroImport(referencePath, macroName)
    const viewImport = utils.macroReplaceImport(config[macroName])
    macroImport.insertAfter(viewImport)

    viewFunc.params = [t.objectPattern(fArguments)]
    node.arguments[0] = t.objectExpression([
      t.objectProperty(t.identifier('args'), t.objectExpression(args)),
      t.objectProperty(t.identifier('fn'), viewFunc)
    ])
  }

  return utils.createMacro(requireWebpackCommentImport)
}
