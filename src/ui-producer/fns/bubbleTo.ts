export function bubbleTo(selector: string, el: HTMLElement) {

  if (!el) {
    return el
  }

  while (!el.matches(selector) && !el.matches('body')) {

    if (!el.parentElement) {
      return el.parentElement
    }

    el = el.parentElement
  }

  if (el.matches('body')) {
    return null
  }

  return el
}