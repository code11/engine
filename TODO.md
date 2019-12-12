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

TODO: Make certain args meaningful - e.g. shouldMount would make sure the view will be shown based on the truthyness of the value