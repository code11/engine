import type {
  ObservePath,
  GetPath,
  UpdatePath,
  Prop,
  Param,
  Arg,
  UpdateValue,
  GetValue,
  Producer,
} from "@c11/engine.types";
import type { View } from "@c11/engine.react";
type StateType = {
  bam: string;
};

declare global {
  type State = StateType;
  type producer = Producer;
  type view<External = any> = View<External>;
  const observe: ObservePath<State>;
  const get: GetPath<State>;
  const update: UpdatePath<State>;
  const prop: Prop;
  const param: Param;
  const arg: Arg;

  type Update<T, P = {}> = UpdateValue<T, P>;
  type Get<T, P = {}> = GetValue<T, P>;
}
