type DataPath = string[];

interface DataObject {
  [key: string]: DataPath;
}

type Data = DataObject | DataPath;

type Operation = string[];

interface Operations {
  [key: string]: Operation;
}

type Util = string;

interface Utils {
  [key: string]: Util;
}

type Render = (args: any) => React.ComponentClass;
type Produce = (args: any) => void;

interface Module {
  data: Data;
  operations: Operations;
  utils: Utils;
}

export interface View extends Module {
  fn: Render;
}

export interface Producer extends Module {
  fn: Produce;
}
