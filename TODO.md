
TODO: How to make producers libs be findable by developers? E.g. ctrl+click on a lib will it take it to the source code?
TODO: Make a link with the data-key or styles used for a component
TODO: For the engineConfig/view/importFrom - resolve the file recursively 
starting from the package.json
TODO: Add Require keyword to avoid using import/require statements



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



TODO: Add destructuring shorthand for data structure:
```
data = Get.items.byId[Prop.foo],
{ title, longName } = Arg.data
```
instead of 
```
    data = Get.items.byId[Prop.foo],
    item = {
      title: Arg.data.title,
      longName: Arg.data.longName
    }
```










