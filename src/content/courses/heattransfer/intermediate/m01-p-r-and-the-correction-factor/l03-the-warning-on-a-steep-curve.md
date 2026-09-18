# The warning on a steep curve

One sweep in this module carries all three answers the correction can give. It holds R at 0.900000 and walks P upward, and it produces a plain answer, then an answer with a warning attached, then a state the engine will not answer at all.

## The sweep

| P | F | warning |
| --- | --- | --- |
| 0.050000 | 0.999587 | none |
| 0.200000 | 0.990786 | none |
| 0.450000 | 0.899076 | none |
| 0.520000 | 0.813593 | none |
| 0.550000 | 0.751428 | yes |
| 0.580000 | 0.654869 | yes |
| 0.600000 | 0.544585 | yes |

The warning arrives on the fifth of those rows. Read the F column downward and the direction is the whole point: the factor falls as P rises, and it falls faster the further up the sweep you read. Do not form a ratio between any two of those rows. This engine computes no ratio between them, and a number a reader produces by dividing one by another is a number nothing in the module stands behind.

{{panel:fc-coefficient-explorer}}

## What the warning says and what it does not

A warning is an answer. The engine returns the factor and says alongside it that the correction curve is steep here, so a small error in the terminal temperatures swings the computed area badly. The remedy it names is another shell pass rather than accepting the number.

That is a different thing from a refusal. The factor on a warned row is the factor the closed form gives, and it is correct. What the warning adds is that the number is fragile: the four temperatures that fed it are measurements, and high on the curve an uncertainty that would be harmless lower down turns into a surface you fall short of.

## The row after the last one

Above the sweep the engine stops answering. Asked for the factor at a P of 0.620000 at that same R of 0.900000, it refuses, and the refusal says the configuration cannot reach this duty and that a shell pass should be added. It does not hand back a lower factor.

That ordering is worth holding on to. A falling factor, then a falling factor with a warning on it, then nothing. The engine never walks off the end of the curve quietly, and the step from the last warned row to the refused one is from a P of 0.600000 to a P of 0.620000.

## Reading a sweep rather than a point

A single answer tells you the factor. A sweep tells you where on the curve that answer sits, which is what a design review needs. The seven rows above were computed at one R so that the only thing moving is P.

So the habit is to ask for a neighbour. Compute the factor at the P you have and then at a P a little above it, and the gap between the two tells you what a temperature reading is worth on this exchanger. Low on the curve the answer barely moves. High on it the answer moves enough to change the tube count, and the engine says so before a reader has to notice it.

## Exercise

Record the seven P values in the sweep with the factor at each, and note which row the warning first appears on. Then record the P the engine refuses at the same R, and write one sentence on what separates a warned answer from a refused one.
