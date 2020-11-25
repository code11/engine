import type {
  ObservePath,
  GetPath,
  UpdatePath,
  Prop,
  Param,
  Arg,
  UpdateValue,
  GetValue,
  ProducerFn,
} from "@c11/engine.types";
import type { State as StateType } from "./state";

declare global {
  type State = StateType;
  type producer = ProducerFn;
  const observe: ObservePath<State>;
  const get: GetPath<State>;
  const update: UpdatePath<State>;
  const prop: Prop;
  const param: Param;
  const arg: Arg;

  type Update<T, P = {}> = UpdateValue<T, P>;
  type Get<T, P = {}> = GetValue<T, P>;
}
