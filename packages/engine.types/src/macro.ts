export enum PathType {
  GET = "Get",
  OBSERVE = "Observe",
  UPDATE = "Update",
  PROP = "Prop",
  ARG = "Arg",
}

export enum PathArgs {
  EXTERNAL = "Prop",
  INTERNAL = "Arg",
  PARAM = "Param",
}

export enum PathSymbol {
  EXTERNAL = "@",
  INTERNAL = "$",
  INVOKABLE = ":",
}
