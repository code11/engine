export enum PathType {
  GET = "Get",
  SET = "Set",
  MERGE = "Merge",
  REF = "Ref",
  PROP = "Prop",
  ARG = "Arg",
  REMOVE = "Remove",
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
