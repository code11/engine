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
  EngineContext,
  EngineEmitter,
  EventNames,
} from "@c11/engine.types";
import { randomId } from "@c11/engine.utils";

type SourceUpdateListeners = {
  [k: string]: {
    [k: string]: UpdateSourceFn;
  };
};

export class EngineModule {
  name: string;
  private state: EngineModuleState = EngineModuleState.NOT_BOOTSTRAPPED;
  private db: DatastoreInstance;
  private engineContext: EngineContext;
  private id: string;
  private source: EngineModuleSource;
  private producers: ProducerInstance[] = [];
  private context: ModuleContext;
  private emit: EngineContext["emit"];
  private sourceUpdateListeners: SourceUpdateListeners = {};

  constructor(context: EngineContext, module: EngineModuleSource) {
    this.engineContext = context;
    const emit: EngineContext["emit"] = (name, payload = {}, context = {}) => {
      this.engineContext.emit(name, payload, {
        ...context,
        moduleId: this.id,
      });
    };
    this.emit = emit.bind(this);
    this.source = module;
    this.name = this.source.name;
    this.db = context.db;
    this.id = randomId();
    this.context = {
      onSourceUpdate: this.addSourceUpdateListener.bind(this),
      addProducer: this.addProducer.bind(this),
      emit: this.emit.bind(this),
    };
  }

  private addSourceUpdateListener(sourceId: string, cb: UpdateSourceFn) {
    const id = randomId();
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
      ...extendedContext,
      db: this.db,
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
    this.emit(EventNames.MODULE_MOUNTED, {
      name: this.source.name,
    });
    await this.source.mount(this.context);
    this.state = EngineModuleState.MOUNTED;
  }

  async stop() {
    this.state = EngineModuleState.UNMOUNTING;
    await this.source.unmount(this.context);
    this.emit(EventNames.MODULE_UNMOUNTED);
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
