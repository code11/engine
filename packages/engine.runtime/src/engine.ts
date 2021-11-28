import db from "@c11/engine.db";
import { randomId } from "@c11/engine.utils";
import {
  EngineApi,
  EngineConfig,
  EngineState,
  EngineModuleSource,
  DatastoreInstance,
  ProducerConfig,
  ViewConfig,
} from "@c11/engine.types";
import { EngineModule } from "./module";

const updateListeners: {
  [k: string]: (sourceId: string, config: ProducerConfig | ViewConfig) => void;
} = {};

export const update = (config: ProducerConfig | ViewConfig) => {
  Object.values(updateListeners).forEach((x: any) => {
    x(config.sourceId, config);
  });
};

export type EngineContext = {
  engineId: string;
  db: DatastoreInstance;
};

export class Engine implements EngineApi {
  id: string;
  private db: DatastoreInstance;
  private modules: EngineModule[] = [];
  constructor({ state = {}, use = [] }: EngineConfig) {
    this.id = randomId();
    this.db = db(state);
    use.forEach((x) => {
      this.use(x);
    });
    updateListeners[this.id] = (sourceId, config) => {
      this.modules.forEach((x) => {
        x.update(sourceId, config);
      });
    };
  }

  state(state: EngineState) {
    Object.entries(state).forEach(([x, y]) => {
      this.db.patch([{ op: "add", path: `/${x}`, value: y }]);
    });
  }

  use(source: EngineModuleSource) {
    const module = new EngineModule(
      {
        engineId: this.id,
        db: this.db,
      },
      source
    );
    this.modules.push(module);
  }

  start() {
    this.modules.forEach((x) => {
      x.start();
    });
  }

  stop() {
    this.modules.forEach((x) => {
      x.stop();
    });
    delete updateListeners[this.id];
  }
}

export const engine = (config?: EngineConfig) => {
  return new Engine(config || {});
};
