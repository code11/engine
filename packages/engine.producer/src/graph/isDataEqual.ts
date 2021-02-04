import { ProducerData, ValueSerializer } from "@c11/engine.types";
import { nanoid } from "nanoid";
import isPlainObject from "lodash/isPlainObject";
import isEqual from "lodash/isEqual";
import isArray from "lodash/isArray";
import isFunction from "lodash/isFunction";
import isObject from "lodash/isObject";
import { GetOperationSymbol } from "./getOperation";
import { UpdateOperationSymbol } from "./updateOperation";

// TODO: this needs to go only a few levels deep - it shouldn't compare through the actual data

const removeOperations = (
  data: ProducerData,
  serializers: ValueSerializer[],
  result: any = {},
  set = new WeakSet()
) => {
  let serializer = serializers.find((x) => {
    return x.instanceof && data instanceof x.instanceof === true;
  });
  if (serializer) {
    result = serializer.serializer(data);
  } else if (isObject(data)) {
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
            result[key] = removeOperations(
              value,
              serializers,
              result[key],
              set
            );
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

export const isDataEqual = (
  prevData: ProducerData,
  data: ProducerData,
  serializers: ValueSerializer[]
) => {
  // const rawPrevData = removeOperations(prevData, serializers);
  // const rawData = removeOperations(data, serializers);
  // const result = isEqual(rawPrevData, rawData);
  const replacer = (key: string, value: unknown) => {
    if (isPlainObject(value) || isArray(value) || value !== Object(value)) {
      return value;
    } else if (typeof value === "symbol" || value instanceof Symbol) {
      return value.toString();
    }
    return nanoid();
  };
  const result =
    JSON.stringify(prevData, replacer) === JSON.stringify(data, replacer);

  return result;
};
