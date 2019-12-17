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

TODO: Handle animations (such as transitions to/from views/modals/sidebars) entirely at the stylesheets level

TODO: Add support for states and state transitions.

TODO: Create a self storage location

- should be available using Get['@self'].data.foo
- and a way to customize where the self will be: e.g. for self: "sections/byId/SECTION_NAME"
- adding a `self` on the args object will overwrite a unique - generated self by the framework










