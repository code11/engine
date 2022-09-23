import isObjectLike from "lodash/isObjectLike";
import uniqBy from "lodash/uniqBy";
import values from "lodash/values";
import flattenDeep from "lodash/flattenDeep";
import { isProducer } from "./isProducer";

export const extractProducers = (...args: unknown[]): any[] => {
  let result: unknown[] = flattenDeep(args);

  result = result.map((x) => {
    if (isProducer(x)) {
      return x;
    } else if (isObjectLike(x)) {
      return values(x).map((y) => {
        if (isProducer(y)) {
          return y;
        } else {
          return extractProducers(y);
        }
      });
    }
  });

  result = flattenDeep(result);
  result = result.filter(isProducer);
  result = uniqBy(result, "buildId");

  return result as any[];
};
