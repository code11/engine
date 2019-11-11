export function getValue(el: HTMLElement, prop: string) {
  let val

  if (prop === 'value') {
    val = (el as HTMLInputElement)[prop]
  } else {
    val = el.getAttribute(prop)
  }

  // Handle return case
  if (typeof val === 'string') {
    val = val.replace(/\r/g, '')
  }

  // Handle null, undefined
  val = val == null ? '' : val

  return val
}