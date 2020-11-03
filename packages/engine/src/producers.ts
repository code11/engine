import { ModuleContext, MacroProducerType } from "@c11/engine.types";

export const producers = (list: MacroProducerType[]) => {
  return {
    mount: (context: ModuleContext) => {
      list.map((x) => context.addProducer(x)).map((x) => x.mount());
      return Promise.resolve();
    },
    unmount: (context: ModuleContext) => {
      context.removeProducers();
      return Promise.resolve();
    },
  };
};
