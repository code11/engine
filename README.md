# UI Engine

```javascript
import { view } from '@code11/ui-engine';

export default {
  args: {
    foo: '<prop1>',
    bar: '/bar'
  },
  fn: ({ foo, bar }) => (
    <div>
      {foo} {bar}
    </div>
  )
};
```


```javascript
import view from '@c11/ui-engine/view.macro';
import { IGet } from '@c11/ui-engine';
import State from "./state";

const Get = IGet<State>;

export default view((
    foo = Get['@prop1'],
    bar = Get.bar
 ) => (
  <div>
    {foo} {bar}
  </div>
));
```
