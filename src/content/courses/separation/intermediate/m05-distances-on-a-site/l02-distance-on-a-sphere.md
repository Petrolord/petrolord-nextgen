# Distance on a sphere

The ERHA station is laid out from a datum at 4.741200 north and 7.183600 east, and every distance on it is measured with the haversine formula on a sphere rather than on a flat grid.

{{panel:fc-layout-explorer}}

## The distances on this plot

| from | to | distance m |
| --- | --- | --- |
| Wellhead 1 | Wellhead 2 | 5.0281 |
| Wellhead 1 | Inlet separator | 60.6850 |
| Inlet separator | Crude tank | 75.2397 |
| Crude tank | Transfer pump A | 43.1555 |
| Transfer pump A | Transfer pump B | 1.2067 |
| Crude tank | Flare stack | 182.5778 |
| Flare stack | Control room | 46.1777 |

A site plan at a real latitude is not a flat grid, and the engine does not pretend otherwise. Degrees of longitude shrink as latitude rises, so a plan that treats a difference in degrees as a fixed number of metres is wrong by an amount that depends on where the site is.

## Checked against two independent methods

| case | haversine m | Vincenty m | chord m |
| --- | --- | --- | --- |
| portHarcourt90m | 89.4099 | 89.4099 | 89.4099 |
| portHarcourtDueNorth | 489.2584 | 489.2584 | 489.2584 |
| highLatitudeSmallDLon | 55.5975 | 55.5975 | 55.5975 |
| equator | 1111.9508 | 1111.9508 | 1111.9508 |

Vincenty solves on an ellipsoid and the chord cuts straight through the earth rather than following the surface. At the scale of a plot plan all three agree to the figure printed, including the high-latitude case where a flat-grid method would already be drifting. The agreement is the point: over a few hundred metres the choice of earth model does not matter, and the choice between a sphere and a grid does.

## What sits next to what

A list of distances is only half of a layout reading. The other half is what each item has nearest to it and what the table asks of that pair. The production manifold's nearest neighbour is the chemical injection skid at 5.8533 m, against a requirement of null. The inlet separator's nearest is its own dump valve at 2.8348 m, against a requirement of 0.000000 m. The heater treater's nearest is the separator relief valve at 19.4836 m, again against 0.000000 m.

Only one of those four is a finding, and it is the pair that looks least dramatic: Transfer pump A stands 1.2067 m from Transfer pump B against a requirement of 3.000000 m. Reading the nearest-neighbour list is how a reviewer notices the pairs that a table row alone would never bring to their attention.

## Centre to centre

Every distance here runs from one item to another, which in practice means from one icon to another, and an icon sits at the centre of the thing it represents. A published spacing table is usually written edge to edge, because that is how a fire or a maintenance access is thought about.

Those are different measurements of the same gap, and the difference is half of each item. On a small item it is negligible and on a large one it is not: a tank inside an 18.000000 m bund carries 9.0000 m of that difference on its own.

## The mistake

The mistake is comparing a centre-to-centre distance against an edge-to-edge requirement without saying so. It is not a rounding error and it always points the same way, making the plot look more generous than it is.

## Exercise

Give the distance from the crude tank to the flare stack and from the flare stack to the control room. State what Vincenty and the chord are doing in the published cases and what their agreement shows. Then explain what a centre-to-centre distance leaves out when it meets an edge-to-edge requirement.
