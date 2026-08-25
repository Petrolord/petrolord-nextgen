# Where control points live

Property population runs on control points, and the points were built one tier down. This lesson re-collects them from the Professional tier with the Expert tier's question in mind: not "what are their values" but "where do they STAND", because standing is what block labelling reads.

## The zone A control set

| Well | x | y | phi | Weight (m MD) |
| --- | --- | --- | --- | --- |
| W1 | 1100 | 2100 | 0.315 | 35 |
| W2 | 1610.8719179395334 | 2200 | 0.2935651232824187 | 120 |
| W3 | 1900 | 2700 | 0.277 | 45 |
| W4 | 2050 | 2150 | 0.2765 | 46 |

Each point is the well path's position at the zone's MD midpoint; each weight is the interval's MD length; each value is the well's zone A porosity. Three of the four locations are wellheads, because three wells are vertical. W2's is not, and the fourth decimal place of its x coordinate is one tier's worth of trajectory work.

Notice the VALUES' pattern before any geostatistics: porosity falls from west to east, 0.315 at W1 down to 0.2765 at W4, smoothly, about 0.004 of porosity per 100 m eastward. Module four will fit that pattern with a plane and discover something suspicious about how well the plane fits; hold the observation until then.

## Precision of the values

W1, W3 and W4 carry round values, 0.315, 0.277, 0.2765: their zone A porosities as logged. W2's 0.2935651232824187 has fifteen significant digits, and it is worth knowing why: it is not a logged number but a DERIVED one, the fixture's zone A porosity evaluated along W2's deviated transit, and it participates in every downstream weighted mean at full precision. When module three of this course computes the graded block 0 porosity of 0.28631191845445614, most of those digits trace back to W2's value and weight. Rounding W2's value to 0.2936 before the weighted mean moves the graded answer in its sixth decimal, inside tolerance but no longer exact; the engine never rounds, and hand checks that want the full digits must not either.

## One point per well per zone

The convention bears repeating at this tier because its alternative matters here. Each well contributes ONE point per zone, at one location, however long its transit. A deviated well crossing a long zone is thus collapsed to its midpoint: W2's 120 m of zone A hole, spanning x 1568 to 1653 in the model, becomes a single point at x 1610.87. For a well crossing a FAULT within the zone, the collapse would put the whole well's zone value on one side, whichever side the midpoint lands on, even though the hole sampled both blocks. No golden well crosses the fault within zone A, but W2 comes close enough to make the thought experiment vivid, and the convention's sharp edge is exactly where the next lesson lives.

## Worked example

Recompute W2's control point location from Professional-tier machinery, as a refresher in this tier's context: zone A interval 1580 to 1700 m MD, midpoint 1640; the hold runs from station 1500 at x 1511.876968573417 with 140 m of hole to the midpoint; east travel $140/\sqrt{2} = 98.99494936611665$; x $= 1511.876968573417 + 98.99494936611665 = 1610.8719179395334$. The point stands 210.87 m east of the wellhead at (1400, 2200), on the same y row, at TVDSS 1539.0898442132484. Every Expert-tier statistic involving W2 stands on this spot.

## Exercise

Write the zone B control set from the Professional tier's numbers: locations, and weights (W2's zone B point is at x 1674.5115282463228, y 2200, weight 60; the vertical wells' are at their wellheads with weight 30 each). Then answer: which zone's control set has its points more evenly weighted, and what single fact about W2 explains the difference between the zones' weight spreads?
