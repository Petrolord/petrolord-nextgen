# When the acid stops short

The published job does not remove the damage, and the engine says so plainly.

{{panel:st-acid-explorer}}

## The mismatch

Damage in this well runs out to 0.9 m. The chosen acid front radius is 0.6 m. The acid is being planned to reach two thirds of the way across the damaged zone and stop.

So there is a shell of damaged rock left, from 0.6 m out to 0.9 m, still at the reduced permeability. The engine returns `removed: false` and a residual skin of 1.62.

## Where the residual comes from

The skin after treatment is the same Hawkins expression as before, applied to what is left. Permeability is taken as restored everywhere inside the acid front, so the damaged shell now runs from the front radius out to the damage radius rather than from the wellbore. The contrast is unchanged at 5.

The engine returns exactly zero only when the front radius reaches or passes the damage radius. Until then something is always left, and the code makes that a hard condition.

That is the whole lesson: a job that stops short does not get partial credit in proportion to the money spent.

## What the residual costs, and what removing it costs

| Front radius, m | Volume, m3 | Skin after | Damage removed |
|---|---|---|---|
| 0.3 | 6.64 | 4.39 | no |
| 0.45 | 16.19 | 2.77 | no |
| 0.6 | 29.55 | 1.62 | no |
| 0.75 | 46.72 | 0.73 | no |
| 1.2 | 121.16 | 0.00 | yes |

The residual reaches zero at a front radius of 0.9 m, which asks for 67.72 m3. That is the honest price of full removal here: more than twice the published job, to clear the last 1.62 of skin.

And look at the bottom row. Going out to 1.2 m costs 121.16 m3 and returns the same zero. In this model, once the damage is gone the acid buys nothing at all. The reward saturates, hard.

## The optimism you should carry forward

The model restores permeability completely inside the front. Real acid does not do that, and a treated sandstone often keeps a small positive skin from unrecovered fines and reaction products. So 1.62 is a floor for this design, not a forecast.

## Exercise

First, in the panel, walk the front radius from 0.6 m upward and note the volume at the point where the removal flag flips.

Second, decide whether you would recommend 29.55 m3 or 67.72 m3 on this well, and write the one sentence of justification you would put in front of a client.
