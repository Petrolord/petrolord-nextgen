# How far apart they get

The distance between a crossing and an affinity map is not fixed. It depends on how big the change was and which way it went, and the quotients the engine prints are how far apart the two answers are for that change.

{{panel:fc-suction-explorer}}

## Reading the trim rows

| trim ratio | flow quotient | head quotient |
| --- | --- | --- |
| 1.000000 | 1.000000000 | 1.000000000 |
| 0.950000 | 1.036203885 | 0.980245113 |
| 0.900000 | 1.099939243 | 0.951552997 |
| 0.850000 | 1.195804570 | 0.918910857 |
| 0.800000 | 1.356430057 | 0.881865458 |
| 0.750000 | 1.688794663 | 0.839967688 |

At a trim ratio of 1.000000 both quotients are 1.000000000, which is the row where no change was made. On the rows printed here, the flow quotient rises as the trim ratio falls, reaching 1.688794663 at 0.750000, and the head quotient falls across the same rows to 0.839967688.

## Reading the speed rows

| speed ratio | flow quotient | head quotient |
| --- | --- | --- |
| 0.700000 | 1.718977148 | 0.837451028 |
| 0.800000 | 1.247569076 | 0.905043418 |
| 0.900000 | 1.084062477 | 0.958078196 |
| 1.000000 | 1.000000000 | 1.000000000 |
| 1.100000 | 0.949032669 | 1.033460604 |

A speed change can go either way, and the row at 1.100000 is the one to look at. There the flow quotient is 0.949032669 and the head quotient is 1.033460604, which is the reverse of the arrangement on the row at 0.700000, where they are 1.718977148 and 0.837451028.

## What is behind the shape

Scaling the machine moves its curve. The system curve stays where it is, so the new crossing slides along a fixed system curve while the affinity map slides along the machine's own law. The two paths start at the same point, at a ratio of 1.000000, and they are different paths, so the further a change goes the further apart they land.

The direction follows from the same picture. A machine scaled down meets the fixed system at a flow the machine's own law would not have predicted, and a machine scaled up meets it at a different one.

## What this is worth in practice

A reader who wants an instinct for when the distinction matters can take it from these rows. Small changes put the two answers close together, and a proposal that moves a machine a long way puts them far apart. The trouble is that the far-apart cases are exactly the interesting proposals, because a change worth making is usually not a small one.

## The mistake

The mistake is calibrating on a small change and generalising. A reader who checks the two methods at a trim ratio of 0.950000, sees a flow quotient of 1.036203885 and decides the difference does not matter will carry that conclusion to a trim ratio of 0.750000, where the flow quotient is 1.688794663.

The second mistake is assuming the flow quotient and the head quotient move together. At a trim ratio of 0.750000 they are 1.688794663 and 0.839967688, and at a speed ratio of 1.100000 they are 0.949032669 and 1.033460604.

## Exercise

Give both quotients at a trim ratio of 0.750000 and at speed ratios of 0.700000 and 1.100000. Then explain why both quotient columns read 1.000000000 at a ratio of 1.000000, and say what changes about the arrangement when a speed ratio goes above 1.000000.
