# What it refuses

A refusal is a feature. The module has three ways of saying no and they are not equally good, so a user has to know which one they are getting.

## The stack refuses a bad pipe, and says why

Hand `overallU` a layer whose conductivity cannot be resolved and it comes back with `ok = false` and the message "A layer could not be resolved: every layer needs an inside diameter, a larger outside diameter and a positive conductivity." Hand it a layer whose outside diameter is smaller than its inside and you get exactly the same refusal, because it is exactly the same input class.

Hand it no layers at all and it says "A pipe needs at least one layer: its own wall."

Those are the good refusals. The call fails, the message names the field, and nothing plausible comes back.

## The bare NaN, which is not an object

`relaxationLengthFt` returns a number rather than a result object, so it has no place to put an error. Give it a zero U, a zero mass rate or a zero heat capacity and what comes back is a NaN. The two mass helpers behave the same way: `pipeMassLbPerFt` with an outside diameter no larger than the inside is a NaN, and `contentsMassLbPerFt` with a zero density or a zero bore is a NaN.

A NaN is honest. It is also silent, and a caller who does not check gets it everywhere downstream.

## Two refusals that are different refusals

`uForArrivalTemp` inverts the balance and refuses two different impossibilities with two different sentences. On the published fluid at 180.0 degF against a 40.0 degF ambient, a target arrival of 40.00 degF or 39.00 degF is refused with "A line cannot arrive above ambient (40 F) no matter how well it is insulated. The target has to be above it." A target of 180.00 degF or 185.00 degF is refused with "The fluid already enters below the target, so insulation is not the problem."

One is a physical impossibility. The other is a question about the wrong thing. The messages say which.

## The one that is correctly not a refusal

Run a profile with an inlet 20.0 degF below the 40.0 degF ambient and the engine returns `ok = true` and an arrival of 39.5203295082 degF. That is right. A cold line warms towards its surroundings on the same exponential, and this is the one direction of the balance that needs no special case at all.

## The mistake

Assuming that `ok = true` means the call did what you asked. It means nothing in the guarded list was hit, and the guarded list is shorter than the list of ways a pipe can be described wrongly.

## Exercise

Write out the three refusal messages and beside each the input that triggers it.

Then say why a NaN from `relaxationLengthFt` is more dangerous in a spreadsheet than a refusal from `overallU`.
