import { Data } from "./data";

export namespace Command {
  export type Event<Data = unknown> = {
    id?: string;
    time?: Data.Timestamp;
    data?: Data;
    source?: unknown;
  };

  export type Trigger = Data.Timestamp;

  type CommandTypes = Record<string, Event | Trigger>;

  export type List<Commands extends CommandTypes> = Commands;
}
