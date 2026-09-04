# A branch that asserts what it never checked

The note opens by telling you what the ratio is doing. Nothing in the branch that prints it looks at the ratio.

{{panel:pd-candidate-explorer}}

## The condition and the sentence

The branch fires on the derivative alone: every late sample has to satisfy `Math.abs(p.derivative) < 1e-12`. The sentence it then prints opens "The ratio is sitting flat at" and a number. That number is the final sample of the series, not a fit, and no test was run on it.

## The same object contradicting itself

On the teaching gas history, a teaching case and not a published one, the note says the ratio is sitting flat at 2151.86 scf/stb. The same return object carries `worSlope` 0.356090047430 and `worR2` 0.949579197952, fitted on the late window opening at t = 504.417216 days over 26 clean samples. That is a ratio climbing steadily and a line that explains most of it. The series runs 957.197245770 to 2151.864191995 scf/stb, a factor of 2.248088575 across the window.

On teaching well ELELENWO-4 with the derivative column spelled null, the note says the ratio is sitting flat at 9.33. The same object carries `worSlope` 1.040602176348 and `worR2` 0.921895186494, on a window opening at t = 250.242976 days. That history opens at a water-oil ratio of 0.048760749, peaks at 14.587294415 and ends at 9.329979637.

| Series | Note says flat at | worSlope | worR2 |
| --- | --- | --- | --- |
| published flat | 1.20 | 0.000000000 | 0.000000000 |
| teaching gas history | 2151.86 | 0.356090047 | 0.949579198 |
| ELELENWO-4, derivative spelled null | 9.33 | 1.040602176 | 0.921895186 |

Both fit qualities are fractions.

## Why nobody noticed

The published `flat` history holds every ratio at 1.200000000 and every derivative at 0.000000000. On that series the sentence is true, and a `worSlope` of 0.000000000 agrees with it. On that series the printed number is also every other sample, so even the value in the sentence is right by accident. The only series the branch was exercised on really was flat, so the assertion and the fields beside it never disagreed.

## Provenance

This is not an oracle finding, because there is no oracle here. The golden publishes no expected mechanism, no expected confidence, no expected verdict and no expected note. The contradiction is established from the engine's own return object, which carries both halves of it.

## The mistake

Reading the note as the finding. A report that copies the sentence says the gas-oil ratio is sitting flat at 2151.86 scf/stb, while the ratio fit in the same result says it climbed by a factor of 2.248088575. In this module a note is a record of which branch executed, not a statement checked against the data. The fields are checked against the data, and here they disagree with the sentence printed beside them.

## What it refuses

The branch refuses nothing and warns about nothing. It does not compare `worSlope` against zero, does not compare `worR2` against a `minR2` of 0.5, and does not soften its sentence when the ratio fit says the opposite.

## Exercise

Run the teaching gas history and write down its note and `worSlope`.

Then say what comparison the branch could have made before printing its sentence, and which field it would have needed.
