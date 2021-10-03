import { pathFn } from "@c11/engine.runtime";

const _windowObj = typeof window !== "undefined" ? window : undefined;

export const debug: producer = ({
  _window = _windowObj,
  getValue = get[param.path],
  setValue = update[param.path],
}) => {
  if (!_window) {
    console.error(
      "Window object was not found. Could not add debug get and set helpers"
    );
    return;
  }

  const makePath = (str: string) => {
    const parts = str.split(".");
    const result = parts.reduce((acc, x) => {
      acc = acc(x);
      return acc;
    }, pathFn);
    return result;
  };

  (window as any).get = (str: string) => {
    if (!str) {
      str = "";
    }
    return getValue.value({ path: makePath(str) });
  };

  (window as any).set = (str: string, value: any) => {
    return setValue.set(value, { path: makePath(str) });
  };
};
