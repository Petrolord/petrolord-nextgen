# What a sweep cannot answer

A sweep resolves an event only if its step is smaller than the thing that causes the event. Choosing the step from the axis instead of from the mechanism produces a plot and no information.

{{panel:pd-unloading-explorer}}

## Two mechanisms, two required resolutions

The decrement reaches the verdict continuously, through valve depths, temperatures, dome charges and the stage casing pressure at once. Its flip sits between 26.80 and 26.90 psi per valve, so a step of a tenth of a psi finds it and a step of a psi does not.

The design gas rate reaches the verdict only through `selectPort`, so it moves nothing until the target crosses a catalogue step. It reads 0.124769727 psi at 400, 600, 800, 1000, 1200 and 1400 Mscf/d and then 15.249903355 psi at 1600 Mscf/d.

| Axis | Shape | Useful step |
| --- | --- | --- |
| Decrement, psi per valve | Continuous | Tenths of a psi |
| Bellows area, in2 | Continuous | Fine |
| Design gas rate, Mscf/d | Stepped through port selection | The catalogue crossings only |

A 50 Mscf/d sweep across that stretch returns identical rows all the way, and halving the step returns more identical rows. An axis with no mechanism behind it produces a smooth curve of nothing, and the smoothness reads as confidence.

## What no resolution recovers

A sweep will not say which side of the flip is right. It measures distance to an edge, not the direction to be on. The published stage 5 verdict is 0.124769727 psi at surface by the engine and 0.149791635 psi at valve depth by the published closing rule, two small numbers of the same sign for one knife edge, and neither says the string is well designed. Nor will a sweep say what two inputs do together, since every row holds all but one fixed.

## What the physics behind the sweep will not carry

The gas column under every row is static, with no friction, no velocity and no injection rate in the annulus, so the casing pressure is a shut in column. The unloading and transfer lines are straight lines on constant gradients, declared as inputs. Intermittent lift is not modelled. A sweep maps the engine, and the engine is not the well.

## The mistake

Treating the number of points as the measure of a sweep's quality. Forty points on an axis with a step mechanism resolve less than four points placed at the catalogue crossings, and they cost more.

## Exercise

Name the mechanism each of the three swept axes uses to reach the multipointing verdict, then say what step size each one needs.

Then state one question about this design that no sweep of any resolution can answer, and say what would answer it instead.
