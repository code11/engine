import { ReactElement } from "react";
import { ProducerConfig } from "./producer";

export enum PathType {
  GET = "get",
  OBSERVE = "observe",
  UPDATE = "update",
  PROP = "prop",
  ARG = "arg",
}

export enum PathArgs {
  EXTERNAL = "prop",
  INTERNAL = "arg",
  PARAM = "param",
}

export enum PathSymbol {
  EXTERNAL = "@",
  INTERNAL = "$",
  INVOKABLE = ":",
}

type producerFunction<T = any> = (props: T) => void;
type viewFunction<T> = (props: T) => ReactElement<T> | null;

export type MacroProducerType<T = any> = producerFunction<T> | ProducerConfig
export type MacroViewType<T=any> = viewFunction<T> & {producers?: MacroProducerType[]};
