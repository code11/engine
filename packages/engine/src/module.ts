import { Producer } from "@c11/engine.producer";
import {
  ModuleContext,
  EngineModuleSource,
  ProducerInstance,
  ProducerConfig,
  EngineModuleState,
  DatastoreInstance,
  MacroProducerType,
} from "@c11/engine.types";

export class EngineModule {
  private state: EngineModuleState = EngineModuleState.NOT_BOOTSTRAPPED;
  private db: DatastoreInstance;
  private source: EngineModuleSource;
  private producers: ProducerInstance[] = [];
  private context: ModuleContext;

  constructor(db: DatastoreInstance, module: EngineModuleSource) {
    this.source = module;
    this.db = db;
    this.context = {
      addProducer: this.addProducer.bind(this),
      removeProducers: this.removeProducers.bind(this),
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

  private removeProducers() {
    this.producers.forEach((x) => {
      x.unmount();
    });
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
}
