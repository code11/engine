import { OperationTypes } from "@c11/engine.types";

const defaultStats = {
  [OperationTypes.OBSERVE]: 0,
  [OperationTypes.UPDATE]: 0,
  [OperationTypes.GET]: 0,
};

const parseParams = (params) => {
  const stats = Object.assign({}, defaultStats);
  if (!params) {
    return stats;
  }

  if (params.type === OperationTypes.STRUCT) {
    let result = Object.values(params.value).reduce((acc, x) => {
      if (x.type === OperationTypes.OBSERVE) {
        acc[OperationTypes.OBSERVE] += 1;
      } else if (x.type === OperationTypes.UPDATE) {
        acc[OperationTypes.UPDATE] += 1;
      } else if (x.type === OperationTypes.GET) {
        acc[OperationTypes.GET] += 1;
      }
      return acc;
    }, stats);
    return result;
  } else {
    return stats;
  }
};

export const elementStats: producer = ({
  elements = observe.structure.elements,
  updateStats = update.structure.stats,
}) => {
  if (!elements) {
    return;
  }

  const result = Object.values(elements).reduce((acc, x) => {
    acc[x.buildId] = parseParams(x.params);
    return acc;
  }, {});

  updateStats.set(result);
};
