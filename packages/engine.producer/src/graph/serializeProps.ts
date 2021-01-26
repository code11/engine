import {
  ExternalProps,
  ValueSerializer,
  GraphNodeType,
} from "@c11/engine.types";

type Result = {
  serialized: {
    [k: string]: any;
  };
  nonSerialized: {
    [k: string]: any;
  };
};

export const serializeProps = (
  props: ExternalProps,
  serializers: ValueSerializer[]
): Result => {
  const serialized = Object.keys(props).reduce((acc, x) => {
    const result = serializers.reduce((acc, y) => {
      if (y.type && y.type !== GraphNodeType.EXTERNAL) {
        return acc;
      }

      if (y.name && y.name !== x) {
        return acc;
      }

      let specificity = 1;
      if (y.type === GraphNodeType.EXTERNAL) {
        specificity += 1;
      }

      if (y.name === x) {
        specificity += 1;
      }
      if (y.instanceof && props[x] instanceof y.instanceof) {
        specificity += 1;
      }

      const value = y.serializer(props[x]);
      if (value === undefined) {
        return acc;
      }

      if (acc.specificity && acc.specificity > specificity) {
        return acc;
      }

      if (acc.specificity === specificity) {
        console.warn(
          "serializer conflict, deep equality will be used instead for",
          x
        );
        return {};
      }

      acc = {
        specificity,
        value,
      };

      return acc;
    }, {} as { specificity?: number; value?: any });

    if (result.value) {
      acc[x] = result.value;
    }

    return acc;
  }, {} as { [k: string]: any });

  const nonSerialized = Object.keys(props).reduce((acc, x) => {
    if (!serialized[x]) {
      acc[x] = props[x];
    }
    return acc;
  }, {} as ExternalProps);

  return {
    serialized,
    nonSerialized,
  };
};
