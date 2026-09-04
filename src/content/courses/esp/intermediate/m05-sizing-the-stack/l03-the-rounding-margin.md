# The rounding margin

The two powers differ by exactly the ratio of the two heads. That is an identity, and it can be shown to be one.

{{panel:pd-lift-explorer}}

## Why it has to hold

Brake power is hydraulic power over efficiency, and hydraulic power is linear in head at a fixed rate and a fixed specific gravity. Rounding the stage count changes the head. It does not change the rate, so it does not move where on the curve the efficiency is read: `sizePump` takes the efficiency at the duty rate, and that rate is an input.

Two brake powers at the same rate, gravity and efficiency, differing only in head, must stand in the ratio of their heads.

## Shown, not asserted

| Case | Power ratio | Head ratio | Difference |
| --- | --- | --- | --- |
| gassyOffshore | 1.000373590543 | 1.000373590543 | -0.0000000000000004 |
| highWaterCut | 1.001099009857 | 1.001099009857 | 0.0000000000000002 |
| QUA-IBOE-4 | 1.005804251445 | 1.005804251445 | 0.0000000000000004 |
| IBENO-2 | 1.025676584275 | 1.025676584275 | 0.0000000000000000 |

Two published golden designs and two teaching wells, agreeing to the last bit a double carries. Swept across fifteen head requirements on the short teaching stack, from 550 ft to 900 ft, the same difference reads 0.0000000000000000 on most steps and never exceeds 0.0000000000000002 in size.

That is what an identity looks like when it is measured. An agreement between two models would drift with the case.

## Bounded by one stage

The margin in head is one stage less the fraction rounded away, so it can never reach a whole stage and never be negative. In stages it is 0.07170260 on gassyOffshore, 0.28982009 on highWaterCut, 0.82611546 on IBENO-2 and 0.99257012 on QUA-IBOE-4, the last being the closest any of the four comes to a full spare stage.

A bound in stages is not a bound in percent, and that is the whole reason the margin matters on some designs and not on others.

## The mistake

Calling the gap between the two powers a modelling difference, a safety allowance or noise. It is the remainder of a ceiling, and it is predictable before either power is computed: multiply the stage count by the head per stage, divide by the head required, and that number is also the ratio of the two powers.

Somebody who thinks it is noise will accept a report where the two powers sit far apart, because noise has no size they expect. Somebody who knows it is an identity looks at 0.76450191 hp on a 29.77428389 hp shaft and asks how many stages that stack has.

## What it refuses

The identity is a statement about this engine's arithmetic, not about pumps. It holds because the efficiency is read at the rate and the rounding moves only the head. An engine that re-read the efficiency at the head made would break it, which is exactly why checking it on a report is worth the minute.

## Exercise

Compute both ratios for every case in the panel and subtract one from the other.

Then predict the power ratio for one case from its stage count and head per stage alone, before reading either power.
