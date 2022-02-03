import db from "@c11/engine.db";
import mitt from "mitt";
import isFunction from "lodash/isFunction";
import isPlainObject from "lodash/isPlainObject";
import { randomId, now } from "@c11/engine.utils";
import {
  EngineApi,
  EngineConfig,
  EngineState,
  EngineModuleSource,
  DatastoreInstance,
  ProducerConfig,
  ViewConfig,
  Events,
  EventNames,
  EngineContext,
  EngineEmitter,
  EngineStates
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

export class Engine implements EngineApi {
  private id: string;
  private db: DatastoreInstance;
  private modules: EngineModule[] = [];
  private emitter: EngineEmitter | undefined;
  private context: EngineContext;
  private state: EngineStates = EngineStates.NOT_RUNNING;
  constructor({ state = {}, use = [], onEvents }: EngineConfig) {
    this.id = randomId();
    this.db = db(state);
    if (onEvents) {
      this.emitter = mitt<Events>();
      if (isFunction(onEvents)) {
        this.emitter.on("*", (eventName, event) => {
          onEvents(event);
        });
      } else if (onEvents && isPlainObject(onEvents)) {
        Object.entries(onEvents).forEach(([name, fn]) => {
          if ((Object.values(EventNames) as string[]).includes(name)) {
            //@ts-ignore
            this.emitter.on(name, (event) => {
              //@ts-ignore
              fn(event);
            });
          }
        });
      }
    }
    this.context = {
      engineId: this.id,
      db: this.db,
      emit: (eventName, payload = {}, context = {}) => {
        if (!this.emitter) {
          return;
        }
        this.emitter.emit(eventName, {
          eventName,
          eventId: randomId(),
          createdAt: now(),
          context: {
            ...context,
            engineId: this.id,
          },
          payload,
        });
      },
    };
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
    const module = new EngineModule(this.context, source);
    this.modules.push(module);
    if (this.state === EngineStates.RUNNING) {
      module.start()
    }
  }

  async start() {
    this.context.emit(EventNames.ENGINE_STARTED);
    this.state = EngineStates.RUNNING;
    this.modules.forEach((x) => {
      x.start();
    });
  }

  async stop() {
    await Promise.all(this.modules.map((x) => x.stop()));
    this.context.emit(EventNames.ENGINE_STOPPED);
    this.state = EngineStates.NOT_RUNNING;
    if (this.emitter) {
      this.emitter.all.clear();
    }
    delete updateListeners[this.id];
  }
}

export const engine = (config?: EngineConfig) => {
  return new Engine(config || {});
};
