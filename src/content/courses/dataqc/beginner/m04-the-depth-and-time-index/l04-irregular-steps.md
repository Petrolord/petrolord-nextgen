# Irregular steps and their tolerance

{{panel:dq-checks-explorer}}

An irregular step is a step in the right direction whose size differs from the expected step by more than the tolerance. It is how the index check sees a sample that was never recorded. On EKENE-7's full depth index there is 1 irregular step, and its reason, verbatim, is: "step 1 from entry 149 differs from the expected 0.5 by more than 5e-7".

That is the skipped sample from module two, seen from the other side. Coverage found it as a hole from 8474.500000 to 8475.500000 ft. The index check finds it as a step from entry 149 that is too long. Completeness never saw it, because no row was there to be empty.

## The splice, flag by flag

The EKENE-7 splice index carries every kind of index problem at once. Its full list of flags:

| entry | value | rules | the engine reasons |
| --- | --- | --- | --- |
| 5 | 8521.500000 | duplicate-index, reversal | index value 8521.5 repeats entry 3; index goes from 8522 to 8521.5, against the increasing direction |
| 6 | 8522.500000 | irregular-step | step 1 from entry 5 differs from the expected 0.5 by more than 5e-7 |
| 8 | 8523.000000 | duplicate-index | index value 8523 repeats entry 7 |
| 10 | 8524.500000 | irregular-step | step 1 from entry 9 differs from the expected 0.5 by more than 5e-7 |
| 12 | `null` | missing-index | index entry 12 is missing |
| 13 | 8526.000000 | irregular-step | step 1 from entry 11 differs from the expected 0.5 by more than 5e-7 |

There are 3 irregular steps, and each has a different cause.

Entry 6 follows the reversal. Entry 5 stepped back to 8521.500000 ft, and entry 6 at 8522.500000 ft is a forward step from there that is longer than the expected step. It is the index recovering from the splice.

Entry 10 is a skipped step: entry 9 is at 8523.500000 ft and entry 10 at 8524.500000 ft, with the depth between them never logged.

Entry 13 follows a lost entry. Entry 12 has no depth at all, and the engine flags it as `missing-index`. The step to entry 13 is then measured from the last present entry, entry 11, so the lost row shows up twice: once as missing and once as the long step across it.

## The step after a lost entry

That last rule is a stated choice. The engine could skip the step after a missing entry, on the grounds that there is nothing to measure from. It measures from the last present entry instead, which means a lost row cannot hide the spacing problem it leaves behind. The same idea governs cumulatives in the next module: compare with the last present value.

## The reason strings and the fields

Each irregular-step reason prints its figures in the shortest form that reads back exactly. When you reason with the figures, take them from the fields and the summary: expected step 0.500000 ft, tolerance 5.00e-7 ft. Quote the reason only as the engine's own sentence.

## Loosening the tolerance

With a stated expected step of 0.5 and a stated tolerance of 0.6, the splice reads 0 irregular steps. All three disappear, and with them the only sign that a depth was skipped at entry 10. The missing entry, the duplicates and the reversal are still flagged. A tolerance is a statement about what size of error you accept, and it should come from the tool and the question.

## Exercise

Open the checks explorer on the index view, which opens on the EKENE-7 splice. Read the Irregular steps and Missing entries tiles and find each irregular-step flag in the table. For each, write which of the three causes above it belongs to. Now replace the `null` at entry 12 with a depth that fills the gap between 8525.000000 and 8526.000000 correctly, read both tiles again, and explain which two flags disappeared together.
