
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

TODO: Add params property to sections structure

TODO: Remove set from Ref and merge

TODO: Add analysis and decision trees for states on views

TODO: Write an opposite article on: https://reactjs.org/docs/lifting-state-up.html

TODO: Add Path operation that gets the path of a given arg
foo = Get.data.foo
baz = Set[PathArg.foo].baz

which is equivalent to:
foo = Get.data.foo
baz = Set.data.foo.baz

TODO: Add arbitrary computation:
foo = 123,
summaryFoo = Arg.foo[x => x.substr(0, 5)]
bam = Get.foo.bar[x => Object.keys(x)]
id = Prop.id[x => toString(x)],
id = (x = Arg.foo, y = Prop.bar) => x + y

TODO: Add support for dynamic paths using environment variables
const foo = { bar: 'abc' }
const a = view((
  title = Get.list[foo.bar].title
))

TODO: Add wildcard for triggering execution:
const a = producer((
  description: Get.list[*].description,
  setSummary: Set.list[*].summary
) => setSummary(description.substr(0, 30)))

the wildcard will be identical for both Set and Get at the moment of execution

Get.list[Wildcard].foo
Get.list[$].foo
Get.list[Any].foo
Get.list[_].foo

TODO: Generate ID for unique elements that need to be managed during their lifetime:

Matter.producers = [enableSection, i
forms, dropdowns, etc

form = Get.form.byId[Unique.id]
data = Arg.form.data
triggers = Arg.form.triggers
fieldA = Arg.data.fieldA
fieldB = Arg.data.fieldB
submit = Arg.triggers.submit
---

Although this unique id should be given by the parent - we can't know when this needs to be re-rendered
or hidden, or even taken out from the DOM and then added again.

As such there needs to be a mechanism to generate unique ids inside producers:
id = Random.id
but if we need to generate multiple ids then we need a function
getId = Utils.random.id
getId() - by not using an external library but something from the arguments we can keep the functions pure
and easy to control and test

TODO: Create reusable components and producers for mananging applications:
<Form>
<Router>

producers would need an instantiation phase in order to be reusable (just like view does)
producers = [Ajax({
  location: Path.foo.bar.baz
})]

actually this way the problem of passing props to producers is solved, giving the context
before giving the producers to the Engine.

Ajax.props = {
  id: '123',
  foo: 'bar'
}
producers = [Ajax]

TODO: Create a one page documentation with the syntax:
engine
producer
view
Arg
Prop
Get
Set
Merge
Remove
Param
Ref
Path

TODO: Currently each Get listener will call the producer. This can lead to situations where a remove is made on a state, but there are multiple listeners on the nested props of that state. The producer will be called multiple times for each undefined Get - this might be a problem:

producerA
---
bar = Get.foo.bar
baz = Get.foo.baz
bam = Get.foo.bam

producerC
---
rm = Remove.foo
rm()

ProducerA will be called 3 times, each time with more values as undefined.

Todo: Make object destructring using producer:
const producer = producer((
  { foo, bar } = Get.items
  )=> {})

TODO: Add an extend for producers/views in order to augment their structure:
const a = producer((a = Get.foo.bar))
const b = extend(a, { a: 'static value'})

TODO: Is Arg. really needed?
const a = view(( id = 'foo', bar = Get.foo[Arg.id]) => {})
is equivalent to:
const a = view(( id = 'foo', bar = Get.foo[id]) => {})









