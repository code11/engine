export enum EventNames {
  ENGINE_STARTED = "ENGINE_STARTED",
  ENGINE_STOPPED = "ENGINE_STOPPED",
  VIEW_MOUNTED = "VIEW_MOUNTED",
  VIEW_UNMOUNTED = "VIEW_UNMOUNTED",
  VIEW_CALLED = "VIEW_CALLED",
  PRODUCER_MOUNTED = "PRODUCER_MOUNTED",
  PRODUCER_UNMOUNTED = "PRODUCER_UNMOUNTED",
  PRODUCER_CALLED = "PRODUCER_CALLED",
  DATA_UPDATE = "DATA_UPDATE",
  ERROR = "ERROR",
}

export type Event<Name = EventNames, options = {}> = {
  name: Name;
  createdAt: number;
  sourceId: string;
  parentId?: string;
};
