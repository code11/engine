import db from "@c11/engine.db";
import isFunction from "lodash/isFunction";
import { randomId, now } from "@c11/engine.utils";
import {
  EngineApi,
  EngineConfig,
  EngineState,
  EngineModuleSource,
  DatastoreInstance,
  ProducerConfig,
  ViewConfig,
  EventNames,
  EngineContext,
  EngineStatus,
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
  private context: EngineContext;
  private status: EngineStatus = EngineStatus.NOT_RUNNING;
  private onEvents: EngineConfig["onEvents"];
  constructor({ state = {}, use = [], onEvents }: EngineConfig) {
    this.id = randomId();
    this.onEvents = onEvents;
    this.db = db(state);
    this.context = {
      engineId: this.id,
      db: this.db,
      emit: this.emit.bind(this),
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

  private emit(eventName: EventNames, payload = {}, context = {}) {
    if (!this.onEvents) {
      return;
    }
    if (!EventNames[eventName]) {
      console.error(`unrecognized event name ${eventName}`);
      return;
    }
    const event = {
      eventName,
      eventId: randomId(),
      createdAt: now(),
      context: {
        ...context,
        engineId: this.id,
      },
      payload,
    };

    if (this.onEvents && isFunction(this.onEvents)) {
      this.onEvents(event);
    } else if (
      this.onEvents &&
      this.onEvents[eventName] &&
      isFunction(this.onEvents[eventName])
    ) {
      const fn = this.onEvents[eventName];
      if (fn) {
        fn(event);
      }
    } else {
      // event could not be sent
    }

    if (eventName === EventNames.PATCH_APPLIED) {
      this.emit(EventNames.STATE_UPDATED, this.db.db.static);
    }
  }

  state(state: EngineState) {
    Object.entries(state).forEach(([x, y]) => {
      this.db.patch([{ op: "add", path: `/${x}`, value: y }]);
    });
  }

  use(source: EngineModuleSource) {
    //TODO: add test to ensure it is an engine module
    if (!source) {
      return;
    }
    const module = new EngineModule(this.context, source);
    this.modules.push(module);
    if (this.status === EngineStatus.RUNNING) {
      module.start().catch((e) => {
        console.error(`Module ${source.name} failed to start.`, e);
      });
    }
  }

  async start() {
    this.emit(EventNames.ENGINE_STARTED);
    this.emit(EventNames.STATE_UPDATED, this.db.db.static);
    this.status = EngineStatus.RUNNING;
    this.modules.forEach((x) => {
      x.start().catch((e) => {
        console.error(`Module ${x.name} failed to start.`, e);
      });
    });
  }

  async stop() {
    if (this.status === EngineStatus.NOT_RUNNING) {
      return;
    }
    this.status = EngineStatus.NOT_RUNNING;
    await Promise.all(
      this.modules.map((x) =>
        x.stop().catch((e) => {
          console.error(`Module ${x.name} failed to start.`, e);
        })
      )
    );
    this.emit(EventNames.ENGINE_STOPPED);
    delete updateListeners[this.id];
  }
}

export const engine = (config?: EngineConfig) => {
  return new Engine(config || {});
};
