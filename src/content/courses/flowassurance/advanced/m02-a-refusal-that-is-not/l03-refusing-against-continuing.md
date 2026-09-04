# Refusing against continuing

One module, one class of bad input, three policies. Which one a caller meets depends on which field was wrong.

{{panel:pd-hydrate-explorer}}

## The policy the header states

The conductivity helper states the discipline: "A NaN propagates into a refusal; a plausible wrong number does not." A value that cannot be computed should reach the caller as a refusal, never as a number that survives review because it looks ordinary.

## Where the module keeps it

`overallU` refuses a layer with an unresolvable conductivity, `ok` false, error "A layer could not be resolved: every layer needs an inside diameter, a larger outside diameter and a positive conductivity." A layer whose outside diameter is not larger than its inside gets the same sentence. A pipe with no layers gets "A pipe needs at least one layer: its own wall."

`uForArrivalTemp` separates two impossibilities a single message would have blurred. A target at or below ambient is refused with "A line cannot arrive above ambient (40 F) no matter how well it is insulated. The target has to be above it.", at 40.00 degF and 39.00 degF against the published 40.0 degF ambient. A target at or above the inlet is refused with "The fluid already enters below the target, so insulation is not the problem.", at 180.00 degF and 185.00 degF.

## Where it continues instead

| Bad input | ok | What comes back |
| --- | --- | --- |
| Trench below the D/2 floor | true | 4 terms not 5, U 1.3348791131 against 0.7455927364 |
| Contents mass NaN in a cooldown | true | 1.2806433091 hr against 4.6627248553 hr |

The trench case is a caught NaN pushed nowhere, and the error in U is 79.035960 percent. The mass case is a NaN read through `(contents?.massLbPerFt || 0)`: NaN is falsy in JavaScript, the mass becomes zero, and the no-touch time is -72.534444 percent against the correct one.

## The third policy, a bare NaN

`relaxationLengthFt` returns neither an object nor a refusal. With a zero U, a zero mass rate or a zero heat capacity it returns NaN itself, and an untested NaN travels downstream. The mass helpers do the same: `pipeMassLbPerFt` with an outside diameter no larger than the inside, `contentsMassLbPerFt` with a zero density or a zero bore.

## The mistake

Learning a module's error policy from whichever function you tested first. A reviewer who meets the layer refusals concludes bad geometry is caught, hands the same call a bad trench, and gets a number.

## What it refuses correctly

More than it is given credit for. A cooldown whose target sits below ambient returns `ok` true, hours of Infinity, a meaningful time constant, an empty station list and a written note saying the line settles at ambient and never reaches the target.

## Exercise

Put a bad layer, a bad trench and a NaN contents mass into the panel in turn, and record `ok`, the note and the term count for each.

Then group them by the policy each met, and say which a caller could detect without knowing the right answer first.
