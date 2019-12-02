export enum PathType {
  GET = 'Get',
  SET = 'Set',
  MERGE = 'Merge',
  REF = 'Ref'
}

export enum PathSymbol {
  EXTERNAL = '@',
  INTERNAL = '$',
  INVOKABLE = ':'
}
