# A withheld verdict, and its three reasons

A withheld verdict is the subtlest of the three. The train RAN. The concentrations are real and are reported. What is missing is the pass or fail, and the module says why.

{{panel:pw-train-explorer}}

## Reason one: a stage did not run

Take a three stage train and clear the plate area box. The plate pack cannot be sized without a positive projected area, so it does not run.

What comes back is not a refusal. The train reports 2 of 3 stages ran, complete no, and skipped `["CPI plate pack"]`. It still reports concentrations, 707.618822 ppm and 60.687843 percent, over the 2 of 3 stages that did run. And it reports no verdict at all: `meetsSpec` null and `marginPpm` null.

The reason is on the return in the engine's own words: 1 of 3 stages did not run, so there is no train here to give a verdict on, and the concentrations below are what the stages that DID run would leave.

That is exactly right. A verdict on a train with a missing vessel is a verdict on equipment that is not there.

## What a skipped stage carries

The stage that did not run comes back with its name and its cause and nothing else: a name of `CPI plate pack`, `ran` false, and the error saying a plate pack needs a positive projected plate area in m2.

Nothing else. No cut size, no removal, no warnings. A stage that is not there cannot show a confident process warning beside its own failure, and a reader scanning a stage list cannot mistake an empty row for a working one.

## Reason two: no specification was given

Run a complete train and ask for a verdict without giving it anything to compare against. `meetsSpec` comes back null with the reason that no discharge specification was given.

This module states no discharge limit of its own. It does not have one to fall back on, and a jest test asserts that its declared constants carry no specification-like key at all. The specification is the caller's, out of the caller's own permit or regulation.

## Reason three: the specification was zero

Give it a specification of zero and the verdict is withheld again, with a different reason: a discharge specification must be a positive concentration and this is 0.

That distinction is the whole lesson of the module in one return. A specification of zero is a MISSING INPUT rather than an impossibly strict target, and the module says which of the two it is instead of leaving a reader to read a blank as a failing train.

## The discipline

Three different absences, three different sentences, and in every case the concentrations are still reported. Withholding a verdict costs the reader nothing except the one thing the module has no basis for.

## Exercise

Produce all three withheld verdicts in the panel: clear a stage input, clear the specification, and set the specification to zero.

For each, write down what is still reported and what is null. Then say which of the three you would treat as a data entry error and which as a real design question.
