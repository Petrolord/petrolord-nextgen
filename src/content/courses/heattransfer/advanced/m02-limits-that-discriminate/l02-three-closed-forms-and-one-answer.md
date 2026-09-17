# Three closed forms and one answer

The collapse at a capacity ratio of zero is not a curiosity. It is the sharpest discriminating check this module has, and it costs nothing to run. Three separate closed forms, written in three separate branches of the code, have to produce the same figure on every row of one sweep. A wrong constant in any one of the three breaks the row it sits on and leaves the other two untouched.

{{panel:fc-rating-explorer}}

## What a discriminating check is

A check discriminates when a plausible error changes its outcome, which is a stronger requirement than passing. Imagine a mistyped coefficient in the 1-2 shell form alone. The counter-current and parallel columns still agree with each other, the collapse row now carries two figures rather than one, and the engine's own equality report turns from yes to no.

Now test the same mistake against one ordinary case at a capacity ratio of 0.650000, where the three arrangements legitimately differ. The wrong figure sits in a column where a different figure is expected, and nothing says which of the two it should have been.

## The same test, written as data

| NTU | counter | parallel | 1-2 shell | the three all equal |
| --- | --- | --- | --- | --- |
| 0.250000 | 0.221199 | 0.221199 | 0.221199 | yes |
| 1.400000 | 0.753403 | 0.753403 | 0.753403 | yes |
| 8.000000 | 0.999665 | 0.999665 | 0.999665 | yes |

The last column is the finding. Reporting the equality as an answer rather than leaving a reader to compare six decimals by eye is what makes the row a check instead of a display. A table a human has to scan for a mismatch is scanned carefully once and never again. A table that carries its own verdict is re-checked on every rebuild.

## The limit at the other end

The ceilings work the same way, in the other direction. Parallel flow at a capacity ratio of 0.650000 runs 0.597755 at an NTU of 2.600000 and 0.606059 at 8.000000, against a ceiling of 0.606061. A wrong constant in that closed form shows as a column heading for a ceiling it never arrives at, which is visible without any published figure to compare against.

Between them the collapse and the two ceilings pin the three forms at both ends of the capacity ratio and at both ends of the NTU range. The collapse fixes the three against each other where they must agree. The ceilings fix two of them against a value each one has to approach and never pass. Neither check needs a figure from outside this repository, and neither of them can be satisfied by a wrong closed form.

## Why this matters for an engine with no published case

This module has no published heat exchanger case to take a row from. Limits like these are what stands in, and they stand in honestly, because each one is a known truth that a wrong implementation cannot satisfy by accident. The next two lessons are about what that substitution can and cannot cover.

The alternative would have been to invent a citation, and that is worse than having none. A fabricated source is quoted onward by readers who have no way to check it, and the invention travels further than the number.

## Exercise

Record the three collapse rows above with the equality the engine reports on each. Record the two parallel effectivenesses with their NTUs and the ceiling they approach. Then describe one plausible coding error this pair of checks would catch, and one it would not, and say how you decided.
