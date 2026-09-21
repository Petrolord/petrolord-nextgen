# Delayed ignition is conditional

{{panel:qr-event-tree}}

The delayed ignition probability answers a narrower question than it first appears to. It is the probability that the cloud ignites later GIVEN that it did not ignite at once. It is conditional on the first branch, and the engine treats it that way by construction: it multiplies the delayed ignition probability by one minus the immediate ignition probability before anything else happens. This lesson shows why that reading matters, and what the explosion frequency does when it is dropped.

## The engine's own words

When the input is missing, the engine's refusal states the definition for you:

> delayedIgnitionProbability: must be the probability of delayed ignition GIVEN no immediate ignition, in [0, 1]

The capital letters are the engine's. A value typed into this field is read as conditional, always. There is no switch to read it any other way, because a tree in which delayed ignition could also happen after an immediate ignition would count the same release twice.

## EREMOR, built the right way

EREMOR's release is stated at 5e-4 per year, with immediate ignition 0.1 and delayed ignition 0.3 given no immediate ignition. The delayed ignition branch sits under the no immediate ignition branch, so the frequency reaching it is the release frequency times one minus 0.1. Delayed ignition then takes 0.3 of that, and the split divides the result.

| explosion frequency per year | how the tree was built |
| --- | --- |
| 0.000054000000 | delayed ignition conditional, as the engine builds it |
| 0.000060000000 | delayed ignition taken as unconditional |

Taken as unconditional, delayed ignition is applied to the whole release frequency, including the part that already burned as a jet or pool fire. The explosion frequency rises to 0.000060000000 per year, which is 1.111111 times the right figure.

## Why the error is quiet

The unconditional build is a real tree. Its branch sets can be made to sum to one, and the engine would run it without complaint if an analyst drew it by hand with `eventTree`. Nothing in the arithmetic reveals the fault. The only protection is to know what the probability means, and to draw delayed ignition under the branch where nothing ignited at once.

The size of the error depends on the immediate ignition probability. With EREMOR's 0.1, the overstatement is 1.111111. A release with a higher stated immediate ignition probability would be overstated by more, because more of the release has already burned before the delayed branch is reached.

## Where the sources come from

Published ignition data, such as the direct ignition table you meet next, give immediate ignition directly. The delayed ignition probability is then a statement about what happens to the rest. Reading it that way keeps every piece of the release in exactly one outcome, which is what exhaustive and exclusive branch sets promise.

When a data source quotes a delayed ignition figure, check what it is conditional on before typing it. The engine will accept any value from zero to one, and it will always read your value as GIVEN no immediate ignition.

## Exercise

Divide the unconditional explosion frequency, 0.000060000000 per year, by the conditional one, 0.000054000000 per year, and confirm that you reach 1.111111. Then explain in two sentences which part of the release the unconditional build counts twice, and name the outcome that part has already been counted in.
