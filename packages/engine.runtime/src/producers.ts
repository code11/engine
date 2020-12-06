import {
  ModuleContext,
  MacroProducerType,
  ProducerConfig,
  ProducerInstance,
  UnsubscribeSourceUpdateFn,
} from "@c11/engine.types";
import { nanoid } from "nanoid";

type Config = {
  debug?: boolean;
};

type ProducersCache = {
  [k: string]: {
    instance: ProducerInstance;
    unsubscribeUpdate?: UnsubscribeSourceUpdateFn;
  };
};

export const producers = (list: MacroProducerType[], config: Config = {}) => {
  const producers: ProducersCache = {};
  return {
    mount: (context: ModuleContext) => {
      const producerContext = {
        debug: config.debug || false,
      };
      const listType = list as ProducerConfig[];

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
              const instance = context.addProducer(config, producerContext);
              producers[sourceId].instance = instance;
              instance.mount();
            }
          );
          producers[sourceId] = {
            instance,
            unsubscribeUpdate,
          };
        } else {
          const sourceId = nanoid();
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
