import { ViewConfig } from "@c11/engine.types";
import isObjectLike from "lodash/isObjectLike";
import values from "lodash/values";
import flattenDeep from "lodash/flattenDeep";
import { isView } from "./isView";

export const extractViews = (...args: unknown[]): ViewConfig[] => {
  let result: unknown[] = flattenDeep(args);

  result = result.map((x) => {
    if (isView(x)) {
      return x;
    } else if (isObjectLike(x)) {
      return values(x).map((y) => {
        if (isView(y)) {
          return y;
        } else {
          return extractViews(y);
        }
      });
    }
  });

  result = flattenDeep(result);
  result = result.filter(isView);

  return result as ViewConfig[];
};
