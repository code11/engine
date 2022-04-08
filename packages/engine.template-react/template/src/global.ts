import type _React from "react";
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
  ProducersList,
} from "@c11/engine.types";
import type { View } from "@c11/engine.react";
import type { State as StateType } from "./state";

declare global {
  const React: typeof _React;
  type State = StateType;
  type producer<InternalProps=any, ExternalProps={}> = ProducerFn<InternalProps, ExternalProps>;
  type view<InternalProps=any, ExternalProps={}> = View<InternalProps, ExternalProps>;
  const observe: ObservePath<State>;
  const get: GetPath<State>;
  const update: UpdatePath<State>;
  const prop: Prop;
  const param: Param;
  const arg: Arg;

  type Update<T, P = {}> = UpdateValue<T, P>;
  type Get<T, P = {}> = GetValue<T, P>;
  interface Function {
    producers(producers: ProducersList): void;
  }
}
