TODO: Fix changelog generation

TODO: Remove the DB dependency:
The graph should stay in the engine and views and producers should attach
to the graph.
Views would be able to attach individual elements to the graph and
at compile time it will be known what producer will influence what dom
element.
Also having a single graph for the entire producer and views tree then redundant property listeners and calls can be eliminated.

TODO: Create virtual producers (FUNC)

TODO: Add onDemand flag in ProducerConfig
This will make the producer to act as the model used to do

TODO: Make certain args meaningful - e.g.:

- shouldMount would make sure the view will be shown based on the truthyness of the value

- lifecycle hooks for example : isInViewport: Set.something.something('123')

- these could sit under a namespace e.g. self: { shouldMount: ..., isInViewport: ... }

TODO: Add Toggle action alongside Set, Merge, etc...

TODO: Along onChange add isElementInViewHook for example

TODO: Make some defensive guidelines that throw warnings in development:

- /foo/triggers/bar -> should be only one listener on this path

TODO: Handle animations (such as transitions to/from views/modals/sidebars) from the framework + stylesheet
using addEventListener('transitionend') etc

TODO: Instead of making the engine customizable it might be simpler to create different types of engines:
- @c11/engine-react

- @c11/engine-vue

- @c11/engine will have only producers without a view

Macros will need to use the same engine:
@c11/engine-react.macro
@c11/engine-vue.macro
etc..

This is reaquired





TODO: How to make producers libs be findable by developers? E.g. ctrl+click on a lib will it take it to the source code?

TODO: Add support for states and state transitions.

TODO: Create a self storage location

- should be available using Get['@self'].data.foo
- and a way to customize where the self will be: e.g. for self: "sections/byId/SECTION_NAME"
- adding a `self` on the args object will overwrite a unique - generated self by the framework

TODO: Triggers should always clear themselves e.g. /documents/triggers/selectDocument needs to be removed
after it has been interacted with so that even if the same trigger is made in the future the producers
listening to this value will be notified

TODO: Show a list of active producers and a way to interogate them:

- engine.getActiveProducers() -> [producer]
- producer.stats()
- producer.lastTriggeredBy() -> [path]
- producer.lastArgs() -> {...}
- producer.lastExecutionTime() -> ms
- producer.totalExecutionTime() -> ms

TODO: Show a list of active views and a way to interogate them:

- engine.getActiveViews() -> [view]
- view.lastArgs() -> {...}
- ...etc

TODO: For producers, figure out how to handle non-valid calls - e.g. argument is expected to be X but came as Y.
This could flag an error or a warning in development in order to make it visible to the developer
that the process/flow is broken.

Warning: Broken flow.

This means producer args can have 3 states:

- Non-values (when one or more triggering args are undefined)
- Invalid values (args have been populated but are not compatible - Why did the producer be linked to incompatible paths?)
- Valid values (the args pass the guards)

TODO: Make a link with the data-key or styles used for a component

TODO: Add responsive flags on the state in order to ensure the layout orchestration is kept
in the application code and not in CSS.

TODO: Update to lerna!

import { producer, view, graph, engine } from '@c11/engine
import { producer, view } from '@c11/engine.macro


TODO: Add triggers listening - if the patterns are so that every ui trigger will sit in a standard
location then things like listening to any action taken in the ui to trigger something will be possible:
e.g. closing a dropdown when clicking outside (although there could be no actions taken there...)


TODO: Add support for arrays:
producer({
Foo = [Get.foo.bar1, Get.foo.bar2]
} => {})

TODO: Add events to the engine: engine.on('error', fn), engine.on('update', fn), etc...

TODO: Add producer gathering util from the macro with config:
import { getProducers } from '@c11/engine.macro'

const producers = getProducers({
  path: __dirname + './sections',
  exlude: ...,
  include: ....,
})

TODO: For the engineConfig/view/importFrom - resolve the file recursively 
starting from the package.json

TODO: Add an engine-express with support for working with express (or export as a middleware for express)

TODO: Add in engine-node the capability to use chrome's debugger


TODO: Add Require keyword to avoid using import/require statements

TODO: Remove object structure from fn compilation

TODO: Add hardcore more, linter style modes, allowGlobal: false, etc in order to configure what level
of strictness the macro or engine will operate on or tolerate

TODO: Add error codes and add to docs each possible error (and throw)

TODO: [Macro] add support for identifier instead of arrow function expression
const fn = (foo = Get.foo, setBar = Set.bar) => setBar(foo)
const p = producer(fn)

TODO: [Macro] add suport for nested get operations:
foo = Get.list[Get.selectedId].data[Get.selected.prop]

TODO: Add Remove operation

TODO: Make Prop as default for functions args:
const a = view((foo) => <div>{foo}</div>)
is equivalent to:
const b = view((foo = Prop.foo) => <div>{foo}</div>)

TODO: Verify if Args exist and throw a error/warning:
const a = view((foo = Arg.bar) => <div>{foo}</div>)
this should show a warning because there is not bar arg present