# Touching the line

{{panel:qr-societal}}

A comparison with a criterion has three outcomes, and the middle one is the hardest to get right. A curve can lie below a line, above it, or exactly on it. On paper the last case is clear. In a computer it is not, because a frequency built from a sum of stated inputs may land a hair above or below the value it equals exactly. This lesson shows how the engine decides that a curve touches a line, and why a value at the threshold belongs to the lower of the two states.

## A curve built to sit on the Dutch line

Two scenarios, both stated: a touching scenario at 1e-5 per year with N = 10, and a small scenario at 2e-5 per year with N = 1. The Dutch line starts at N = 10, so the corner at N = 1 is not checked, and at N = 10 the curve carries only the touching scenario.

| N | F(N) per year | line per year | ratio | state |
| --- | --- | --- | --- | --- |
| 10.000000 | 0.000010000000 | 0.000010000000 | 1.000000 | AT_LINE |

The corner's state is AT_LINE and the overall state is TOUCHES.

## The rule in the engine's words

EXCEEDS means strictly above the line at some corner. A corner within 1e-9 relative of the line is AT_LINE, and a curve with no exceedance and at least one AT_LINE corner TOUCHES. The basis says, verbatim:

> within 1e-9 relative of the criterion counts as on it (AT_LINE / TOUCHES), not above it

## The snap, shown by a golden case

The golden case r2p2-touch compares a curve with the R2P2 point. Its F(50) is 1.5e-4 plus 5e-5, which on paper is exactly the point's 0.000200000000 per year. In double precision the sum is 0.00019999999999999998, and the ratio is 0.9999999999999999. The engine returns TOUCHES. Without the snap a plain comparison would call this curve BELOW, although on paper it sits exactly on the point. A sum landing a hair above would be the same accident in the other direction. The snap of 1e-9 relative removes both: a value that close to the criterion is the criterion.

## A threshold belongs to the lower state

A curve exactly on the line TOUCHES it and does not exceed it. That is the engine's convention, the owner's decision for this course: a value at a threshold belongs to the lower band. It follows the published wording. R2P2 paragraph 136 calls an event intolerable if its frequency is "more than" the point, so a frequency equal to it is outside what that sentence calls intolerable. The Expert tier meets the same convention for individual risk and for cost; this tier needs it only for curves and criteria.

## Why TOUCHES is a state of its own

A curve that touches a criterion has no margin at all. Folding TOUCHES into BELOW would hide that; folding it into EXCEEDS would contradict the sources' wording. Keeping it separate lets a report say plainly that the curve meets the criterion with nothing to spare.

## Exercise

In the golden case r2p2-touch, add the two stated frequencies, 1.5e-4 and 5e-5, on paper and confirm they equal the point's 0.000200000000 per year. Then say which state the engine would return if the snap did not exist, given the double precision sum 0.00019999999999999998, and which state it returns with the snap.
