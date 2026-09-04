# A count computed and discarded

The engine counts the samples that argue for the other mechanism. It then reads that count only on paths the well in question never takes.

{{panel:pd-candidate-explorer}}

## The count and its two readers

Two lines after the derivative fit, `chanDiagnosis` computes `negativeDerivatives` as the number of late samples whose derivative is finite and below zero. It reads that value in exactly two places: inside the `!derFit.ok` branch, which fires when the fit could not be made, and inside the flat branch. Whenever three positive samples survive the filter, `derFit.ok` is true, neither branch runs, and the count is dropped on the floor.

On teaching well ELELENWO-4, a teaching case and not a published one, the default `lateFraction` of 0.5 opens the late window at t = 250.242976 days on 19 samples, 15 positive and 4 negative. The fit succeeds on the 15, returns `derivativeSlope` 1.442132492 at `derivativeR2` 0.998513658 over `spanDecades` 0.900620470, and the count of 4 is discarded.

The count is 4 at every window fraction in the derived sweep from 0.20 to 1.00, and it is read at none of them.

## The four published histories cannot exercise it either

The golden publishes four labelled series of 40 samples each, t from 10.000000 to 3000.000000 days. At the oracle window, which starts at t = 186.345364 days, each has 20 late samples.

| History | Late samples | Positive | Negative | Exactly zero |
| --- | --- | --- | --- | --- |
| channelling | 20 | 20 | 0 | 0 |
| coning | 20 | 20 | 0 | 0 |
| displacement | 20 | 20 | 0 | 0 |
| flat | 20 | 0 | 0 | 20 |

Three of them never produce a negative sample, so the count is 0 and the branch that would read it never fires. The fourth reaches the flat branch, where the count is read and is also 0. No published case makes this line of code do anything.

## What the count would have said

The value it carries is a note: "A ratio that has turned back down is itself the coning signature, but confirm it against the plot rather than on this alone." That sentence is written, tested by nothing, and unreachable on any history where three rising samples survive.

## The mistake

Assuming that because the return object carries no coning note, no coning evidence was present. The absence of the note is a statement about which branch executed, not about the well. On ELELENWO-4 four samples argued coning, the engine counted them, and the return object records neither the count nor the argument.

## What it refuses

`chanDiagnosis` never refuses on the strength of the count. There is no threshold on `negativeDerivatives`, no warning attached to it, and no field in the return object that carries it out to the caller.

## Exercise

Run ELELENWO-4 at `lateFraction` 0.30, 0.50 and 1.00 and record the negative count at each.

Then say what would have to be true of a history for the engine to read any of those three counts.
