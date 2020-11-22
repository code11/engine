import { ModuleContext, MacroProducerType } from "@c11/engine.types";

type Config = {
  debug?: boolean;
};

export const producers = (list: MacroProducerType[], config: Config = {}) => {
  return {
    mount: (context: ModuleContext) => {
      const producerContext = {
        debug: config.debug || false,
      };
      list
        .map((x) => context.addProducer(x, producerContext))
        .map((x) => x.mount());
      return Promise.resolve();
    },
    unmount: (context: ModuleContext) => {
      context.removeProducers();
      return Promise.resolve();
    },
  };
};
