# Scaling factors read out of the engine

Before a curve can be scaled, something has to decide by how much. Those factors can be restated in whatever code does the scaling, or they can be asked of the engine. The second is what the studio does, and it is the safer of the two for a reason worth understanding.

{{panel:fc-suction-explorer}}

## Asking at a unit duty

Hand the engine a duty of one and the scaling factors come back as themselves:

| speed ratio | trim ratio | flow factor | head factor |
| --- | --- | --- | --- |
| 1.000000 | 1.000000 | 1.000000000 | 1.000000000 |
| 1.000000 | 0.950000 | 0.950000000 | 0.902500000 |
| 1.000000 | 0.800000 | 0.764000000 | 0.582400000 |
| 1.100000 | 1.000000 | 1.100000000 | 1.210000000 |
| 0.800000 | 1.000000 | 0.800000000 | 0.640000000 |
| 1.100000 | 0.900000 | 0.975150000 | 0.950697000 |

Nothing is restated here. Each figure is what the engine does to a duty of one under that pair of ratios, which makes the scaling visible on the page rather than buried in whatever applies it.

## Reading the rows

The rows with a trim ratio of 1.000000 are pure speed changes, and their factors are the affinity laws in plain sight: a speed ratio of 1.100000 gives a flow factor of 1.100000000 and a head factor of 1.210000000, and a ratio of 0.800000 gives 0.800000000 and 0.640000000.

The rows with a speed ratio of 1.000000 are pure trims, and they do not read that way. A trim ratio of 0.800000 gives a flow factor of 0.764000000 rather than 0.800000000, because the shortfall model is inside these factors. A trim ratio of 0.950000 gives a flow factor of 0.950000000, since that is a trim the model leaves alone.

The last row is both changes at once, a speed ratio of 1.100000 with a trim ratio of 0.900000, and it returns 0.975150000 and 0.950697000.

## Why they are read rather than restated

If the code that draws a chart carries its own copy of the affinity laws and the shortfall model, then the curve on the screen and the duty point on it are produced by two different implementations of the same rules. They agree until one of them changes.

Reading the factors out of the engine removes that possibility. The curve and the point are scaled by the same numbers because they are the same numbers, and when the engine moves they both move together.

## The mistake

The mistake is hand-coding a trim factor as the trim ratio. On a trim of 0.800000 that is 0.800000000 where the engine says 0.764000000, and the chart drawn from it disagrees with the duty printed beside it by an amount nobody can explain from either.

The second mistake is applying a head factor where a flow factor belongs. At a speed ratio of 1.100000 those are 1.210000000 and 1.100000000, and both are plausible-looking numbers near one.

## Exercise

Give the flow and head factors for a pure speed ratio of 0.800000 and for a pure trim ratio of 0.800000, and say which of the four figures the affinity laws alone would have predicted. Then explain what reading the factors out of the engine prevents.
