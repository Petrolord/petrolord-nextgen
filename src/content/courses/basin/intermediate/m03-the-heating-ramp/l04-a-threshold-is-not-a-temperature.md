# A threshold is not a temperature

Interpretation bands are quoted in reflectance, but fieldwork intuition often quotes them in temperature: "the oil window starts around 90 degrees". This lesson shows what that habit costs, using the crossing table of the three golden ramps, because the size of the error is exactly the heating-rate effect you just quantified.

{{panel:bs-kinetics-explorer}}

## The crossing table

Ask, for each ramp, the first whole degree at which the reflectance reaches a threshold. The engine's tables give:

| threshold | 1 degC/Ma | 3 degC/Ma | 10 degC/Ma |
|---|---|---|---|
| Ro 0.5 | 86 | 92 | 99 |
| Ro 0.7 | 115 | 121 | 129 |
| Ro 1.0 | 144 | 151 | 159 |
| Ro 1.3 | 162 | 169 | 177 |

Read it across any row: the same maturity threshold, on the same scheme, is crossed about 13 to 15 degrees apart depending only on how fast the rock warmed. Read it down any column: the bands keep their order, immature to oil to gas, whatever the rate.

So "the temperature of the oil window" does not exist. What exists is the temperature at which this rock, warming at this pace, arrives at the window. A basin that heated its source slowly runs every boundary cooler; a rapidly buried source runs them all hotter.

## The regularity in the table

Each step in the table's rate sequence multiplies the rate by about 3, and each such step shifts every crossing 6 to 9 degrees hotter. The shift is remarkably uniform across thresholds, which is the loglinear behaviour of the curves showing through: multiplying the heating rate by a constant slides the whole reflectance curve along the temperature axis nearly rigidly. A useful field version: order-of-magnitude uncertainty in heating rate is worth about 13 to 15 degC of uncertainty in every maturity boundary.

That regularity is also why the error from quoting band temperatures is bounded and estimable. If someone's mental model was calibrated on basins heating near 3 degC per Ma, applying it to a rapidly subsiding trough heating at 10 degC per Ma places every window about 8 degrees too shallow in temperature, and correspondingly too shallow in depth once a gradient is applied.

## Depth makes it concrete

Convert with a geothermal gradient of 30 degC per km and a surface at 20 degC. The Ro 1.0 boundary sits at 144 degC for the slow ramp and 159 degC for the fast one: depths of 4.13 km and 4.63 km, half a kilometre apart on identical rocks with identical kinetics. Nothing about the rocks differs; only their histories do. A depth-to-maturity rule of thumb transplanted between basins with different subsidence histories mis-places targets by exactly this kind of margin, and now you can compute the margin instead of guessing it.

## What stays honest

Two things survive this lesson intact. Within one basin, where the heating history is broadly shared, maturity boundaries do map to rough temperatures and depths, which is why local rules of thumb work locally. And the reflectance thresholds themselves are portable: Ro 1.0 means the same state of the vitrinite ladder everywhere, which is precisely why maturity is reported in reflectance and not in degrees. The scheme's whole architecture, state variable inside, calibrated read-out outside, is what makes cross-basin comparison possible at all.

## Worked example

A report from a slowly subsiding margin, heating near 1 degC per Ma, places the top of the oil window at 86 degC. A colleague applies that temperature to a young rift where sources heated near 10 degC per Ma. How far wrong are they, in temperature and in state? The rift's rocks cross Ro 0.5 at 99 degC, so at 86 degC they read well short of the threshold, still immature: the borrowed boundary is 13 degrees early, and the colleague has called immature rock mature. In the state, at 86 degC the fast-ramp F is far below the 0.2709 the threshold requires.

## Exercise

Using the table, state the temperature spread across rates for the Ro 1.3 boundary, and the rough shift per factor-of-3 in rate. Then answer in one sentence: why are maturity bands quoted in reflectance rather than temperature?

As a self check: Ro 1.3 is crossed at 162, 169 and 177 degC, a 15 degree spread, about 7 to 8 degrees per factor of 3 in rate. Bands are quoted in reflectance because reflectance measures the state of the vitrinite ladder itself, which is history-independent as a ruler, while the temperature at which any state is reached depends on the heating rate and so belongs to a particular basin's history rather than to the maturity scale.
