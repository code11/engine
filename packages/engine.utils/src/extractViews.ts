import isObjectLike from "lodash/isObjectLike";
import uniqBy from "lodash/uniqBy";
import values from "lodash/values";
import flattenDeep from "lodash/flattenDeep";
import { isView } from "./isView";

export const extractViews = (...args: unknown[]): any[] => {
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
  result = uniqBy(result, "buildId");

  return result;
};
