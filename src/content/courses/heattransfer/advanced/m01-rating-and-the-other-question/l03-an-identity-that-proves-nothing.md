# An identity that proves nothing

The two rating doors are inverses of one another, and the engine is checked in both directions. Take an effectiveness out of an NTU, feed it back, and the NTU you started with comes back. That check is worth running and it is worth understanding, because on its own it establishes nothing at all.

{{panel:fc-rating-explorer}}

## The check, on published inputs

Each row below is an effectiveness computed from an NTU and a capacity ratio, and then the NTU recovered from that effectiveness.

| NTU | capacity ratio | arrangement | effectiveness | NTU recovered |
| --- | --- | --- | --- | --- |
| 1.000000 | 0.500000 | counter | 0.564733 | 1.000000 |
| 2.000000 | 0.800000 | counter | 0.710909 | 2.000000 |
| 3.000000 | 1.000000 | counter | 0.750000 | 3.000000 |
| 1.000000 | 0.500000 | parallel | 0.517913 | 1.000000 |
| 2.000000 | 0.700000 | shell1 | 0.634231 | 2.000000 |
| 1.500000 | 0.000000 | counter | 0.776870 | 1.500000 |

The last column returns the first one on every row. It does so for all three arrangements, and it does so at a capacity ratio of 0.000000 as well as at 1.000000, which are the two ends of the range the engine accepts.

## Why that is not evidence

An identity between a function and its own inverse holds whether or not either one is correct. Put a wrong constant in the closed form for effectiveness, invert that same wrong form, and the round trip still closes. The check cannot fail for the reason you care about, so passing it says only that the algebra was not mistyped twice in opposite directions.

This is the shape to learn. Ask of any check whether it could have failed for a reason other than a typing error. If it could not, it is a consistency test and belongs in the file as one.

The same reasoning disposes of a family of comforting checks. Restating an expression in other units and converting back is a multiplication followed by a division. Rearranging a closed form and confirming it still balances is algebra checking algebra. Both are useful against a slip of the hand and neither can find a wrong physical form, because the wrong form is present on both sides of the test.

## What evidence looks like here

The published file for this module is written by an oracle, and the oracle reaches effectiveness by a different route entirely. For counter-current flow it marches the two-stream system with a fourth-order scheme and a linear shot. For the 1-2 shell form it marches a three-stream system and uses the tube turn-around as a boundary condition. Neither route evaluates the closed form the engine uses.

That is a second method. A figure from it standing beside an engine figure is two methods meeting, which is a thing that could have gone wrong and did not. A published figure in this module is never the engine quoted back at itself, and that is the only reason quoting one means anything.

## What to write beside a rating

Record the inversion as a consistency check and label it as one. Record the independent route separately. A reviewer reading one line that says both has no way to tell which of the two the number came from, and the difference between them is the whole difference between an answer and a result.

## Exercise

Record the six rows above with the NTU each one recovered. Say what the recovery establishes and what it cannot. Then name the two independent routes this module's published effectivenesses are reached by, and write one sentence on why a march of the equations can fail in a way an inversion cannot.
