import { path } from "@c11/engine.runtime";

export const debug: producer = ({
  getValue = get[param.path],
  setValue = update[param.path],
}) => {
  const makePath = (str: string) => {
    const parts = str.split(".");
    const result = parts.reduce((acc, x) => {
      acc = acc[x];
      return acc;
    }, path);
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
