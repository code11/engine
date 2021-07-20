import { RootElement } from "@c11/engine.types";

export const getParentId = (el: HTMLElement | null, root: RootElement) => {
  if (!el || !el.parentElement) {
    return;
  }
  do {
    el = el.parentElement;
  } while (el && !(el.dataset?.stateId || el.isSameNode(root)));

  return el && el.dataset?.stateId;
};
