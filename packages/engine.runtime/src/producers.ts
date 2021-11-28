import {
  ModuleContext,
  ProducerInstance,
  UnsubscribeSourceUpdateFn,
  ProducersList,
  ProducerConfig,
} from "@c11/engine.types";
import { randomId, extractProducers } from "@c11/engine.utils";

type Config = {
  debug?: boolean;
};

type ProducersCache = {
  [k: string]: {
    instance: ProducerInstance;
    unsubscribeUpdate?: UnsubscribeSourceUpdateFn;
  };
};

export const producers = (list: ProducersList, config: Config = {}) => {
  const producers: ProducersCache = {};
  return {
    mount: (context: ModuleContext) => {
      const producerContext = {
        debug: config.debug || false,
      };
      const listType = extractProducers(list);

      listType.forEach((x) => {
        const instance = context.addProducer(x, producerContext);
        instance.mount();

        const sourceId = x.sourceId;
        if (sourceId) {
          const unsubscribeUpdate = context.onSourceUpdate(
            sourceId,
            (config) => {
              if (producers[sourceId]) {
                producers[sourceId].instance.unmount();
              }
              const instance = context.addProducer(
                config as ProducerConfig,
                producerContext
              );
              producers[sourceId].instance = instance;
              instance.mount();
            }
          );
          producers[sourceId] = {
            instance,
            unsubscribeUpdate,
          };
        } else {
          const sourceId = randomId();
          producers[sourceId] = {
            instance,
          };
        }
      });

      return Promise.resolve();
    },

    unmount: () => {
      Object.keys(producers).forEach((x) => {
        producers[x].instance.unmount();
        const unsubscribe = producers[x].unsubscribeUpdate;
        if (unsubscribe) {
          unsubscribe();
        }
      });

      return Promise.resolve();
    },
  };
};
