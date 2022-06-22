import { GetValue, UpdateValue } from ".";
import { OperationTypes } from "./producer";

export enum EventNames {
  ENGINE_STARTED = "ENGINE_STARTED",
  ENGINE_STOPPED = "ENGINE_STOPPED",
  MODULE_MOUNTED = "MODULE_MOUNTED",
  MODULE_UNMOUNTED = "MODULE_UNMOUNTED",
  VIEW_MOUNTED = "VIEW_MOUNTED",
  VIEW_UNMOUNTED = "VIEW_UNMOUNTED",
  VIEW_CALLED = "VIEW_CALLED",
  PRODUCER_MOUNTED = "PRODUCER_MOUNTED",
  PRODUCER_UNMOUNTED = "PRODUCER_UNMOUNTED",
  PRODUCER_CALLED = "PRODUCER_CALLED",
  STATE_UPDATED = "STATE_UPDATED",
  PATCH_APPLIED = "PATCH_APPLIED",
  ERROR = "ERROR",
}

export type EmitFn = (
  eventName: EventNames,
  payload?: {},
  context?: {}
) => void;

export type EngineEventContext = {
  engineId: string;
};

export type ModuleEventContext = {
  moduleId: string;
  moduleName: string;
};

export type ViewEventContext = {
  viewId: string;
};

export type ProducerEventContext = {
  producerId: string;
};

export type OperationEventContext = {
  operationId: string;
  operationType: OperationTypes;
  operationFnName?: keyof UpdateValue | keyof GetValue;
};

export type EventContext = Partial<
  EngineEventContext &
    ModuleEventContext &
    ViewEventContext &
    ProducerEventContext &
    OperationEventContext
>;

export type Event<Name = EventNames> = {
  eventName: Name;
  eventId: string;
  createdAt: number;
  context: EventContext;
  payload: any;
};

export type EventPayload = {
  sourceId?: string;
  parentId?: string;
  [k: string]: any;
};

export type Events = {
  [k in EventNames]: Event;
};
