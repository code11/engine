The data structure validation can be done from the babel macro
typescript only needs to care about 2 things:

1. The function and arguments
2. The output of the module

Each state has a validation function and argument list
States are declared in order of importance

States CAN have a name but it's not mandatory

Will the view args and the validation args be different?

For brevity can they be added only once? As in the
args that the component will receive are also those that are being
validated.

As the args for validation are already computed there is no overhead
if they are passed to the view. The only overhead is if the args
for the view are included in the validation and the validation
is false which makes an unnecessary computation.

At the same time the validation should check if the arguments are valid for
the view. In which case the initial validation makes sense.

Would an ignore for validation be better for optimization purposes
to simplify the syntax?

Mount should be the one that specifies this.

Each class exports statically the args, mount in order to feed the
multiple states system

If a component has multiple states how are the props influenced by this?

The state is computed at runtime and as such the interface must be the same
for every view.

In this sense the props cannot be inferred from the args of each state.

Or can they?

Not creating a view for each state makes this possible - as such
the view function becomes polymorhic - can take on view structure
or an array.

Or for simplicity sake the validation can be done in the actual function.

If it returns null then the next view is considered or none at all!

The guard can be optional. Name is as such.

The guard can take either the same arguments as the view or it.

By using a macro, both the guard and the view receive only the needed args!

As such the args become a bundle of data both needed for the guard and the view.

If necessary to differentiate the specific data, we could have a naming
convention at the args level - but that shouldn't actually be the case -
sometimes a view can need the args from a guard and as such the args
shouldn't.

There should also be a lib for views with certain utilities like:

- translations:

A
!---
foo1: /foo

B
!---
foo2: /foos
bar2: /baz
foo1: /foo

C
!---
foo1: /foo

A, B, C
