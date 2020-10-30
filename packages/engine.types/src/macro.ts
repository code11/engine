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
