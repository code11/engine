import db from "@c11/engine.db";
import { EngineModule } from "./module";
import {
  EngineApi,
  EngineConfig,
  EngineState,
  EngineModuleSource,
  DatastoreInstance,
  ProducerConfig,
  ViewConfig,
} from "@c11/engine.types";

const updateListeners: any = [];

export const update = (config: ProducerConfig | ViewConfig) => {
  updateListeners.forEach((x: any) => {
    x(config.sourceId, config);
  });
};

export class Engine implements EngineApi {
  private db: DatastoreInstance;
  private modules: EngineModule[] = [];
  constructor({ state = {}, use = [] }: EngineConfig) {
    this.db = db(state);
    use.forEach((x) => {
      this.use(x);
    });
    updateListeners.push(
      (sourceId: string, config: ProducerConfig | ViewConfig) => {
        this.modules.forEach((x) => {
          x.update(sourceId, config);
        });
      }
    );
  }

  state(state: EngineState) {
    Object.entries(state).forEach(([x, y]) => {
      this.db.patch([{ op: "add", path: `/${x}`, value: y }]);
    });
  }

  use(source: EngineModuleSource) {
    const module = new EngineModule(this.db, source);
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
  }
}

export const engine = (config?: EngineConfig) => {
  return new Engine(config || {});
};
