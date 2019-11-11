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
