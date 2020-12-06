import { Producer } from "@c11/engine.producer";
import {
  ModuleContext,
  EngineModuleSource,
  ProducerInstance,
  ProducerConfig,
  EngineModuleState,
  DatastoreInstance,
  MacroProducerType,
  ViewConfig,
  UpdateSourceFn,
} from "@c11/engine.types";
import { nanoid } from "nanoid";

type SourceUpdateListeners = {
  [k: string]: {
    [k: string]: UpdateSourceFn;
  };
};

export class EngineModule {
  private state: EngineModuleState = EngineModuleState.NOT_BOOTSTRAPPED;
  private db: DatastoreInstance;
  private source: EngineModuleSource;
  private producers: ProducerInstance[] = [];
  private context: ModuleContext;
  private sourceUpdateListeners: SourceUpdateListeners = {};

  constructor(db: DatastoreInstance, module: EngineModuleSource) {
    this.source = module;
    this.db = db;
    this.context = {
      onSourceUpdate: this.addSourceUpdateListener.bind(this),
      addProducer: this.addProducer.bind(this),
    };
  }

  private addSourceUpdateListener(sourceId: string, cb: UpdateSourceFn) {
    const id = nanoid();
    if (!this.sourceUpdateListeners[sourceId]) {
      this.sourceUpdateListeners[sourceId] = {};
    }
    this.sourceUpdateListeners[sourceId][id] = cb;
    return () => {
      delete this.sourceUpdateListeners[sourceId][id];
    };
  }

  private addProducer(
    config: MacroProducerType,
    extendedContext: any = {}
  ): ProducerInstance {
    const context = {
      db: this.db,
      ...extendedContext,
    };
    // @ts-ignore
    const producer = new Producer(config, context);
    this.producers.push(producer);
    return producer;
  }

  async start() {
    if (
      this.state === EngineModuleState.MOUNTED ||
      this.state === EngineModuleState.BOOTSTRAPING
    ) {
      return;
    }
    if (
      this.source.bootstrap &&
      this.state === EngineModuleState.NOT_BOOTSTRAPPED
    ) {
      this.state = EngineModuleState.BOOTSTRAPING;
      await this.source.bootstrap();
    }
    this.state = EngineModuleState.NOT_MOUNTED;
    await this.source.mount(this.context);
    this.state = EngineModuleState.MOUNTED;
  }

  async stop() {
    this.state = EngineModuleState.UNMOUNTING;
    await this.source.unmount(this.context);
    this.state = EngineModuleState.NOT_MOUNTED;
  }

  async update(sourceId: string, config: ViewConfig | ProducerConfig) {
    if (this.sourceUpdateListeners[sourceId]) {
      Object.values(this.sourceUpdateListeners[sourceId]).forEach((x) =>
        x(config)
      );
    }
  }
}
