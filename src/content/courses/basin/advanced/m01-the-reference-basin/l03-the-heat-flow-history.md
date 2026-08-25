# The heat flow history

The reference basin's heat flow is not a constant. It cools from 80 to 60 mW/m2 across the basin's life, and the model reads it from a four-point history interpolated piecewise linearly in age. This lesson fixes the history, the interpolation, and why a cooling trend is the natural default for a rift-style basin.

## The four points

| age (Ma) | heat flow (mW/m2) |
|---|---|
| 150 | 80 |
| 100 | 70 |
| 50 | 65 |
| 0 | 60 |

Between the points, straight lines in age. The engine evaluates the history at every time step: at 120 Ma it reads 74, at 75 Ma 67.5, at 25 Ma 62.5, at 10 Ma 61. Outside the points it clamps to the nearest end. Internally the engine works in W/m2, dividing the millwatt values by 1000, one of those unit seams worth knowing exists.

Check one of those interpolations by hand, because the exam will: 120 Ma sits 30 Ma along the 50 Ma segment from 150 to 100, a fraction of 0.6, and 80 + 0.6 times (70 - 80) = 74. Exactly the engine's value.

## Why cooling

A basin formed by lithospheric stretching starts hot: thinning brings the asthenosphere closer and heat flow spikes. As the lithosphere re-thickens conductively, heat flow decays toward a stable continental background over tens to a hundred million years. The reference history is that story in miniature: 80 at rifting, a steep early decline, then a gentle tail to 60 today, the steep-then-gentle shape showing in the point spacing, 10 units in the first 50 Ma and 10 more across the remaining 100.

The consequence for maturity is one of this tier's quiet themes. The source's hottest early environment coincides with its shallowest position, and by the time burial has carried it deep, the basal supply is fading. Peak temperature is a negotiation between the two trends, and module 2 will show the outcome: without the erosion event, the source's temperature peaks at 165.60511032656453 degC at 76 Ma, shortly after its big burial step, and the last 76 million years are one long cooling. The Professional tier's stall lesson told you what maturity does during a long cooling era: creeps. Final Ro nonetheless reaches 1.6151780693528823 in that run, almost all of it earned early.

## What the history is not

It is not a temperature history. Heat flow is the basal boundary condition; the temperature any layer feels also depends on the conductivity stack above the basement and on the transient adjustments module 2 teaches. Doubling a layer's conductivity moves temperatures without touching this table, the Associate tier's two-gradient column being the eternal reminder.

It is also not calibrated truth. In real work, heat-flow history is the least observable input and the usual free parameter of calibration, adjusted within physical bounds until modelled maturity matches measured. The Professional tier's QC warning applies with full force: heat can imitate burial at a calibration well, so the geometry must be right before the heat is tuned.

## Worked example

Compute the heat flow the model uses at 90 Ma and at 5 Ma. At 90 Ma: between the 100 and 50 points, 10/50 = 0.2 of the way, 70 + 0.2 x (65 - 70) = 69 mW/m2. At 5 Ma: between 50 and 0, 45/50 = 0.9 of the way, 65 + 0.9 x (60 - 65) = 60.5 mW/m2. Both are single lerps, and both would be the basal flux fed into that step's heat solve.

## Exercise

State the four points from memory and compute the interpolated value at 130 Ma. Then answer in one sentence: why does an early-hot, late-cool history tend to concentrate a source rock's maturation into a particular part of its life?

As a self check: the points are 80 at 150, 70 at 100, 65 at 50, 60 at 0; at 130 Ma the value is 80 + 0.4 x (70 - 80) = 76 mW/m2. An early-hot history concentrates maturation because the kinetics reward the era when high basal heat and deepening burial overlap; once the supply fades, the Arrhenius rates fall exponentially with the cooling, and the stall makes the long tail almost inert.
