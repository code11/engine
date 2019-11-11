import { Patch } from './parsePatch'

export function stringifyPatch(x: Patch[]) {

  const result = x.reduce((acc, z, i) => {
    acc += `${z.op} ${z.path}`

    if (z.value !== undefined) {
      let type = typeof z.value
      if (type === 'string') {
        acc += ` ${z.value}`
      } else if (type === 'number') {
        acc += ` ${z.value}`
      } else if (type === 'object') {
        acc += ` ${JSON.stringify(z.value)}`
      } else if (type === 'boolean') {
        acc += z.value === true ? ` true` : ` false`
      }
    }

    if (i !== x.length - 1) {
      acc += '; '
    }

    return acc
  }, '')

  return result
}