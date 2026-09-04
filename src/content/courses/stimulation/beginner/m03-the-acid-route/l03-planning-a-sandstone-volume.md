# Planning a sandstone volume

Work the published job, then look hard at the shape of the answer.

{{panel:st-acid-explorer}}

## The published inputs

The case in front of you is a 100 m interval at porosity 0.18, a wellbore radius of 0.108 m, damage running out to 0.9 m with a permeability contrast of 5, and a chosen acid front radius of 0.6 m. The pore-volume factor is 1.5.

## Working it in four steps

Start with the annular area between 0.108 m and 0.6 m. Multiply it by the 100 m of interval to get the bulk volume of rock the acid has to reach through. Multiply by the porosity 0.18 to turn that bulk rock into pore space. Multiply by the pore-volume factor 1.5.

The result is 29.55 m3 of acid. That is the number the engine returns as the planning volume, and it is the only number in the sandstone calculation you would put on a job ticket.

Note what did not enter. Permeability did not. The damage contrast did not. The volume depends on geometry and porosity and nothing else. The damage numbers matter for the skin, not for the volume.

## The shape that matters most

The volume carries the square of the target radius, because area does. That single fact governs the economics of every sandstone job.

| Target front radius, m | Planning volume, m3 |
|---|---|
| 0.3 | 6.64 |
| 0.45 | 16.19 |
| 0.6 | 29.55 |
| 0.75 | 46.72 |
| 0.9 | 67.72 |
| 1.2 | 121.16 |

Doubling the front radius from 0.3 m to 0.6 m does not double the acid. It costs slightly more than four times as much, and the "slightly more" comes from the wellbore radius being subtracted out, which matters proportionally more at small radii.

Going from 0.6 m to 0.9 m, a modest sounding extra 0.3 m, takes the job from 29.55 m3 to 67.72 m3. Deep penetration in a sandstone is expensive, and it gets more expensive the deeper you already are.

## Where the engine stops you

The target front radius must exceed the wellbore radius, or the engine throws. There is no meaning to an acid front inside the hole, and the annular area would come out negative.

## Exercise

First, reproduce 29.55 m3 by hand from the four steps above, and confirm you get the engine's number rather than something close to it.

Second, in the panel, find the front radius at which the planning volume passes 100 m3, and say in one sentence why the gap between successive rows of the table keeps widening.
