const utils = require('./utils')
const t = require("@babel/types")

const transformParams = (params, referencePath, fArguments, args) => {
  params.forEach((a, i) => {
    if (a.type === 'AssignmentPattern') {
      const paramName = a.left
      const paramPath = referencePath.parentPath.get(`arguments.0.params.${i}`)

      fArguments.push(t.objectProperty(paramName, paramName, false, true))

      if (t.isMemberExpression(a.right)) {
        const ar = utils.collect(a.right)
        args.push(
          t.objectProperty(
            paramName,
            t.arrayExpression(ar.map(a => t.stringLiteral(a)))
          )
        )
      } else if (t.isLogicalExpression(a.right)) {
        const localArgs = []
        const visitor = utils.parseExpression(localArgs)
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
}

module.exports = (macroName) => {
  const requireWebpackCommentImport = ({
    referencePath,
    config
  }) => {
    const node = referencePath.parentPath.node
    const viewFunc = node.arguments[0]
    const params = node.arguments[0].params

    const args = []
    const fArguments = []
    transformParams(params, referencePath, fArguments, args)

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
