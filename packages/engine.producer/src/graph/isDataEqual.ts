import { ProducerData } from "@c11/engine.types";
import isEqual from "lodash/isEqual";
import isFunction from "lodash/isFunction";
import isObject from "lodash/isObject";
import { GetOperationSymbol } from "./getOperation";
import { UpdateOperationSymbol } from "./updateOperation";

// TODO: this needs to go only a few levels deep - it shouldn't compare through the actual data

const removeOperations = (
  data: ProducerData,
  result: any = {},
  set = new WeakSet()
) => {
  if (isObject(data)) {
    Object.entries(data).forEach(([key, value]) => {
      if (
        value &&
        value.__operation__ &&
        value.__operation__.symbol &&
        value.__operation__.id &&
        isFunction(value.__operation__.symbol.toString) &&
        // the toString() conversation is due to the way clone-deep works
        // and clones Symbols - this should be removed in future releases
        // when the data clonning approach is revisited
        (value.__operation__.symbol.toString() ===
          UpdateOperationSymbol.toString() ||
          value.__operation__.symbol.toString() ===
            GetOperationSymbol.toString())
      ) {
        result[key] =
          value.__operation__.symbol.toString() + value.__operation__.id;
      } else {
        if (isObject(value)) {
          if (!result[key]) {
            result[key] = {};
          }
          if (set.has(value)) {
            result[key] = value;
          } else {
            set.add(value);
            result[key] = removeOperations(value, result[key], set);
          }
        } else {
          result[key] = value;
        }
      }
    });
  } else {
    result = data;
  }

  return result;
};

export const isDataEqual = (prevData: ProducerData, data: ProducerData) => {
  const rawPrevData = removeOperations(prevData);
  const rawData = removeOperations(data);

  const result = isEqual(rawPrevData, rawData);

  return result;
};
