export enum PathType {
  GET = 'Get',
  SET = 'Set',
  MERGE = 'Merge',
  REF = 'Ref',
  PROP = 'Prop'
}

export enum PathSymbol {
  EXTERNAL = '@',
  INTERNAL = '$',
  INVOKABLE = ':'
}