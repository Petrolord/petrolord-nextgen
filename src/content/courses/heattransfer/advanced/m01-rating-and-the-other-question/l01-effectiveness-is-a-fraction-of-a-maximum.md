# Effectiveness is a fraction of a maximum

Sizing asks how much surface a duty needs. Rating asks the other question. Given a surface you already own, what fraction of the most heat that could possibly be moved does this machine actually move. Effectiveness is that fraction, and it is the number this tier is built on.

{{panel:fc-rating-explorer}}

## What the fraction is taken against

The maximum is set by the smaller of the two capacity rates and the difference between the two inlet temperatures. Nothing about the arrangement enters that maximum. The arrangement enters the fraction.

Two dimensionless numbers decide it. NTU is the surface written dimensionlessly, and the capacity ratio is the smaller capacity rate over the larger one. Give the engine those two and an arrangement and it returns the fraction. Both of them are pure numbers, so a fraction quoted from them carries no units and no flow rates with it.

## Three arrangements at one NTU

At an NTU of 1.400000 the three arrangements this module carries answer as follows.

| capacity ratio | counter | parallel | 1-2 shell |
| --- | --- | --- | --- |
| 0.000000 | 0.753403 | 0.753403 | 0.753403 |
| 0.350000 | 0.695454 | 0.628836 | 0.659770 |
| 0.650000 | 0.643699 | 0.545902 | 0.588924 |
| 1.000000 | 0.583333 | 0.469595 | 0.517151 |

Read across a row. Counter-current is the highest of the three wherever the three differ, and at a capacity ratio of 0.000000 all three agree. Read down a column. The fraction falls as the capacity ratio rises, because a cold stream that heats up quickly closes the driving force it was given.

Those are directions the table shows. It does not show a ratio between any two of these figures, and forming one produces a number nothing here stands behind. This engine computes no such ratio, so no lesson may quote one.

## What comes back with the fraction

The answer carries three fields. The effectiveness, the arrangement it was computed for, and a ceiling. The arrangement is echoed because the same NTU and the same capacity ratio give three different answers, so a fraction quoted without its arrangement is a fraction of nothing in particular.

The ceiling is the subject of two later lessons. At a capacity ratio of 0.000000 it is 1.000000 for all three arrangements. For counter-current flow at every other capacity ratio the engine returns no number at all, which is an answer rather than a gap.

## Why a fraction rather than a duty

A duty depends on the inlet temperatures of the day. A fraction does not. Fix the surface and the two flows and the fraction holds while the weather moves, which is exactly what the hot-day rating in this tier turns on. That is why this module reports the fraction and lets the duty follow from it.

The order matters for a reader as much as for the engine. A duty read first invites the question of what it was divided by. A fraction read first says what the machine is, and the duty of any particular afternoon is then one multiplication away.

## Exercise

Record the twelve figures in the table above with the NTU and the capacity ratio each one belongs to. Say which arrangement leads at each capacity ratio and by what direction the column moves. Then write, in one sentence, why the row at a capacity ratio of 0.000000 carries one figure three times, and state what you would need before you could quote any ratio between two of the other figures.
