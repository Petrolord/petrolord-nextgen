# A heavier annulus buys margin

A column of fluid is the backup for the string it stands outside of. Weight it up and that string gains allowable pressure, without a single change to the steel.

{{panel:wi-annulus-explorer}}

## Which string a column protects

Take two adjacent annuli, an inner one and an outer one, with a casing string between them.

For a row evaluated in the inner annulus on that string, the fluid in the outer annulus is the backup. It stands on the far side of the wall and it pushes inwards. In the row it enters as `backupDensityKgM3` and it carries a plus sign.

So the fluid you place in an annulus is a design input for the element inside it, not only a completion detail for the annulus it fills.

## What the weight up buys

Take the fixture element at a factor of 0.8 on a limit of 30000000 Pa, at a TVD of 2048.29303343 m, with 1200 kg/m3 in the annulus being assessed:

| Backup density, kg/m3 | Allowable surface pressure, Pa |
| --- | --- |
| 1030 | 20585228.21103133 |
| 1200 | 24000000 |
| 1500 | 30026067.862885892 |
| 1800 | 36052135.725771785 |

Moving the outer column from 1030 kg/m3 to 1200 kg/m3 lifts the allowable by 3414771.788968672 Pa, at the standing rate of 20086.892876286307 Pa per kg/m3 for an element at this depth.

That is a real and defensible gain. It is also cheap, since it is a fluid choice rather than a workover.

## Why it is a genuine engineering lever

Three properties make this worth reaching for.

It is linear, so it is easy to plan. You know exactly what a proposed weight up is worth before you pump it.

It scales with depth, because the slope is g multiplied by the true vertical depth. On the published well the three candidates sit at 1435.457478934607 m, 1167.3419238429642 m and 997.0400302755012 m, so the same weight up is worth most to the deepest one and least to the shallowest.

And it acts on the differential rather than on the pipe, so it works on a string you cannot inspect, cannot repair and cannot re-rate.

## The condition attached

The gain lasts only as long as the column does. If the outer annulus can be bled, can lose returns to a thief zone, or can gas up above a leak, then the margin you counted on can leave without notice.

## Exercise

Reproduce the four rows above and confirm the gain from 1030 kg/m3 to 1200 kg/m3.

Then work out what weight up the deepest candidate on the published well would need to gain the same amount, and say whether you would attempt it.
