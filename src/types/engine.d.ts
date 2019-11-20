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

import { view } from '../lib/view';

export default((
  title,
  // tempValue = Set.view['$id'].tempValue
  submit,
  theme,
  something = Set.views['$id'].state.something,
  somethingVal = Get.views['$id'].state.something,
  some = Path.views['$id'].state['@r']
) => <div>{title}
<input onUpdate={tempValue(this.value)} />
<button onSubmit={something(some.get({r:ev.target}))}
</div>)

interface ListItem {
  title: string
}

import listItem from 'components/listItem'

// ListItem for this specific app
export default view((
  title: Get.foo.bar,
  submit: Set.foo.baz,
) => <listItem titl={title} submit={submit} />

