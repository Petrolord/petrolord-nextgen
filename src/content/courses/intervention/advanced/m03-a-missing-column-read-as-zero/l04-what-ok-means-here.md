# What ok means here

`ok` comes back true on the reading that spends money, true on the reading that refuses to, and true on the run that read an empty column. It means the function ran.

{{panel:pd-candidate-explorer}}

## Four runs of one function

Teaching well ELELENWO-4, a teaching case and not a published one.

| Run | ok | Mechanism | Confidence | derivativeSlope |
| --- | --- | --- | --- | --- |
| default window | true | channelling | low | 1.442132492 |
| derivative spelled undefined | true | indeterminate | low | n/a |
| derivative spelled null | true | displacement | n/a | n/a |
| a history of 5 samples | false | indeterminate | n/a | n/a |

The first row is fitted on the positive-derivative samples in a window opening at t = 250.242976 days. Only the short history returns `ok = false`, with the error "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more."

Counting samples is the one thing the module does before it reads. Everything it does after reading comes back `ok = true`.

## What to read instead

`confidence` is n/a on the flat branch and low at the default window, so it separates them. A `derivativeSlope` of n/a says no derivative fit happened, and a `spanDecades` of n/a says the same. A run with a named mechanism and n/a in all three fields reached a verdict without fitting the series the verdict is about.

## Two failure contracts in one module

`skinPiMultiplier` returns an object with `ok = false` and an error string. `pssDenominator`, `minimumSkin` and `skinFromPiRatio` return a bare NaN for the same bad geometry, a wellbore radius larger than the drainage radius. A caller that reads `ok` on one and forgets `Number.isFinite` on the others cannot tell an answer from a refusal, because a bare NaN carries no flag.

## The mistake

Gating a pipeline on `if (result.ok)`. That accepts a mechanism read off an empty derivative column and rejects only a history of fewer than six samples. It is the check that looks like diligence and buys none.

## What it refuses

`chanDiagnosis` refuses a history too short to read and nothing else. There is no refusal for a missing derivative column, none for a low ratio fit quality, none for a mechanism the analyst's window would reverse. No golden sits behind any of it: the oracle asserts nothing about mechanism, confidence or verdict, so `ok = true` is not a claim anything checked.

## Exercise

Run ELELENWO-4 at the default window and then with the derivative column spelled null, and record `ok`, mechanism, confidence and `derivativeSlope` for each.

Then write the condition you would use in place of `if (result.ok)` to keep the second run out of a screening.
