# What a tubing curve is

A list of rows and a reduction over them. The second half is where people get hurt.

{{panel:pd-vlp-explorer}}

## The object

A finite list of rate and required pressure pairs, plus the smallest pressure among them. The engine is explicit that this minimum is a REDUCTION over sampled rows and moves with the sampling.

| Curve | Sample count | Rate bound |
| --- | --- | --- |
| BONNY-7 | 37 points | 4324.444444 stb/d |
| FORCADOS-3 | 65 points | 4135.949669 stb/d |
| Published golden dry gas | 25 points | 13289.296319 Mscf/d |

The rate bound is the absolute open flow, so the curve inherits its horizontal axis from the INFLOW. Recalibrate the reservoir and the tubing curve is redrawn at a different spacing with a different sampled minimum, no tubing having moved.

## Why it does not start at zero

The left end sits at one thousandth of the bound, 4.324444 and 4.135950 stb/d and 13.289296 Mscf/d, because most outflow models are singular at zero. It always lands slightly under the dead column: 2545.501142 psia against 2570 psia on BONNY-7, 4293.189726 against 4310 psia on FORCADOS-3.

## Two ends, two families

| Well | Loaded end, psia | Friction end, psia |
| --- | --- | --- |
| BONNY-7 | 2545.501142 | 12560.087474 |
| FORCADOS-3 | 4293.189726 | 3310.421637 |

BONNY-7 carries 0.00064 psi per (stb/d) squared against 2150 psi of weight; FORCADOS-3 carries 0.000105 against 3350 psi. Both bend. Where the bottom sits relative to the bound decides which end is higher.

## The reduction moves

| Well | Sampled minimum, stb/d | Sampled bhp, psia | At 20001 points, stb/d | At 20001 points, psia |
| --- | --- | --- | --- | --- |
| BONNY-7 | 604.341111 | 1477.003621 | 627.069742 | 1476.243252 |
| FORCADOS-3 | 1811.804452 | 2348.447272 | 1843.619418 | 2348.191408 |

The gaps are -22.728631 stb/d and 0.76036884 psi on BONNY-7, -31.814966 stb/d and 0.25586360 psi on FORCADOS-3: tens of stb/d in rate, under a psi in pressure, because a minimum has zero slope and the curve is flat there.

The golden dry gas curve is the pure case. Its minimum of 13.289296 Mscf/d at 952.986300 psia is the first row, because a curve that only rises has no bottom. A reduction returns a real row, not always a real feature.

## What it refuses

It has no reservoir, so it cannot say whether the well flows, and it answers nothing outside 4.324444 to 4324.444444 stb/d on BONNY-7. It does not carry its resolution either: the 22.728631 stb/d gap is visible only because someone resampled and compared.

## Exercise

In the panel, read BONNY-7's sampled minimum and its finely sampled minimum.

Then say which of the two quantities you would put in a design document unqualified.
