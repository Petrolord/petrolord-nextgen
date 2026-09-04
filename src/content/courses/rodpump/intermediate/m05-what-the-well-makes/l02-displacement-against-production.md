# Displacement against production

Three rates come back from one call, and each one gives away something the one before it kept.

{{panel:pd-card-explorer}}

## The three rates

| Rate | ODUMA-4, bbl/d | Stroke it is built on |
| --- | --- | --- |
| rated displacement | 380.874258458 | the surface stroke |
| swept displacement | 351.739329047 | the plunger stroke |
| produced | 316.565396142 | the plunger stroke, times fillage |

The design also reports the ratio of the last to the first: produced over rated is 0.831154611. All three arrive in the same unit, in the same object, with nothing on their faces to say which is a rating and which is an answer.

## What each step gives away

The rating is built on the surface stroke of 106.687716837 in, which the four-bar linkage delivers to the polished rod. The plunger never sees it. By the time the motion has travelled a rod string carrying 4690.299657039 lb of fluid load, the march returns a plunger stroke of 98.526653100 in, and the difference between the two rates is the rod string.

The swept rate is what that plunger travel sweeps if the barrel fills every time. Multiplying by the fillage is meant to remove the part of the barrel that held gas or nothing, and multiplying by the pump efficiency, which is 1 here, is meant to remove leakage.

## The plunger is the lever

| Plunger, in | Produced, bbl/d | PPRL, lb | Worst loading, percent |
| --- | --- | --- | --- |
| 1.2500 | 171.610889 | 17041.875221 | 71.721589 |
| 1.5000 | 240.265058 | 18214.446551 | 77.942485 |
| 1.7500 | 316.565396 | 19545.877783 | 82.873308 |
| 2.0000 | 396.784160 | 21110.431299 | 89.702671 |
| 2.2500 | 468.819923 | 22756.352510 | 102.235377 |

Five contiguous teaching rows on ODUMA-4. Production and peak load rise together, and the last row comes back with rodOverstressed.

## The mistake

Writing the rating on the design sheet as the deliverability. On ODUMA-4 that is 380.874258458 bbl/d in place of 316.565396142, and it is the first number anyone writes down because it is the first one the arithmetic reaches. A rating is a multiplication over a stroke the pump never travels, at a fillage nobody checked.

## What it refuses

It refuses to model anything that separates a swept volume from a produced one, except two numbers a caller typed. No gas interference, no valve slippage other than the pump efficiency, no tubing movement and no unanchored string. The whole chain from the barrel to the tank is 0.831154611 on this design, and every part of that shortfall is either the rod string or an assumption.

## Exercise

Read all three rates on ODUMA-4 in the panel and write each with the stroke it stands on.

Then set the plunger to 2.2500 in, record the produced rate and the warning that comes with it, and say which of the two you would report first.
