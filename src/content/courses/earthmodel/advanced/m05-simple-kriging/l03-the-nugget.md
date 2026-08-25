# The nugget

The nugget never moves the value at a well. What it moves is everything NEXT TO a well, and this lesson quantifies that with the engine's own numbers, because "the nugget adds noise" is the folklore version and the folklore points the wrong way.

{{panel:em-population-explorer}}

## The ten-metre experiment

Krige at (1110, 2100), ten metres east of W1, sweeping the nugget with everything else golden:

| Nugget | Estimate at 10 m | At W1 itself |
| --- | --- | --- |
| 0 | 0.3146497325086454 | 0.315 |
| 0.00025 | 0.3123130959413633 | 0.315 |
| 0.001 | 0.3051890098674056 | 0.315 |
| 0.002 | 0.2954588721042163 | 0.315 |

Read the columns against each other. The right column is a wall: exactness, last lesson, at every nugget. The left column falls from "essentially W1" to "essentially the far-field mean" as the nugget grows. At nugget 0, ten metres costs 0.0004 of porosity: the map leaves the well gently, since correlation at 10 m is 0.9983 and there is no discontinuity. At the golden 0.00025, ten metres costs 0.0027. At 0.002, still a VALID nugget below the 0.0025 sill, ten metres costs 0.0195: the map has jumped four fifths of the way from W1's value to the mean before you have walked past the drill floor.

So the nugget is a CLIFF HEIGHT at the data, not blur spread over the map. The map with the big nugget is not noisier; it is SMOOTHER away from wells and more violent at them: flat mean-coloured plains with a spike at every well, honouring each and believing none an inch beyond its location.

## What the nugget is saying, in modelling terms

The nugget's share of the sill, here 10 percent, is the fraction of the field's variance attributed to same-site effects: measurement error plus sub-resolution geology. The kriging weights respond by discounting each individual data point's relevance to its surroundings; with the honor-the-data construction, the discount applies everywhere EXCEPT at the point itself, which is what manufactures the cliff. Nugget at 80 percent of sill says "individual well values barely predict even their own neighbourhood", and the map duly reverts to the mean everywhere it can.

The panel shows the whole story on the profile: sweep the nugget upward and watch block 0's green curve flatten toward the arithmetic mean while staying pinned at W2's white dot. The pinning IS the convention; the flattening is the discount.

## Choosing a nugget with four wells

You cannot, from this data, and the honest posture is the same as the range's: assume, sweep, and report sensitivity. What the sweep shows HERE is reassuring for the capstone and instructive in general: the graded probe at (1500, 2500) moves only from 0.2916 (nugget 0) to 0.2906 (nugget 0.002), one grading tolerance across an eightfold nugget swing, because the probe stands 320 m from the nearest well, far from any cliff. Nugget sensitivity concentrates NEAR WELLS; probes and volumes read far from wells barely feel it. Knowing WHERE a parameter matters is worth as much as knowing its value.

## Worked example

Express the cliff as a fraction, the way a reviewer can audit at a glance. At the golden nugget, the 10 m estimate 0.3123130959413633 sits between W1's 0.315 and the far-field mean 0.2905162808206047: the drop from W1 is 0.0026869, the full W1-to-mean distance is 0.0244837, so ten metres travelled 10.97 percent of the way to the mean. At nugget 0.002 the same ratio is $\left(0.315 - 0.2954588721042163\right)/0.0244837 = 79.81$ percent. One step, one ratio, and the nugget's meaning is visible without a map.

## Exercise

Predict, without running it, the ORDER of the four sweep values above if the experiment were repeated 100 m from W1 instead of 10 m, and state which end of the nugget sweep changes most between the 10 m and 100 m experiments and why (think about where each curve has already arrived by 100 m).
