# Unloading the tubing to gas

Nothing about the annulus changed. The tubing did, and the annulus lost almost all of its allowable.

{{panel:wi-annulus-explorer}}

## The term that was doing the quiet work

Module 4 left you with the row in its differential form: the factored rating, less the annulus head, plus back whatever the far side of that wall is holding up.

The published fixture is one casing element. Rating 30000000 Pa, factor 0.8, so a rating term of 24000000 Pa. True vertical depth 2048.29303343 m. Annulus fluid at 1200 kg/m3, and on the far side a brine at 1030 kg/m3.

The annulus column at that depth is worth 24104271.45154357 Pa on its own. Only 3414771.788968672 Pa of it reaches the wall, because the head term is charged on the DIFFERENCE of the two densities, 170 kg/m3 rather than 1200. The allowable comes out at 20585228.21103133 Pa.

## What gas on the far side does

Gas has a density a small fraction of any brine or completion fluid, and the engine's own default, when a row is given no backup fluid at all, is zero.

Watch the same element with the far side getting lighter:

| Far side density, kg/m3 | Net density, kg/m3 | Head charged, Pa | Allowable, Pa |
| --- | --- | --- | --- |
| 1030 | 170 | 3414771.788968672 | 20585228.21103133 |
| 800 | 400 | 8034757.150514523 | 15965242.849485476 |
| 500 | 700 | 14060825.013400415 | 9939174.986599585 |
| 150 | 1050 | 21091237.520100623 | 2908762.4798993766 |
| 0 | 1200 | 24104271.45154357 | -104271.45154356956 |

The annulus density is 1200 kg/m3 in every one of those rows. So is the depth, the rating and the factor. The only thing that moved is what stands on the other side of the steel.

## The rate at which it goes

The engine's sensitivity for this element is 20086.892876286307 Pa of allowable for every kg/m3 of far side density. That is a linear price, and it runs both ways. A far side that gains density buys allowable at exactly the same rate as a far side that loses it gives allowable back.

It also means the loss is not a cliff. The last table row is not a different mechanism from the first. It is the same subtraction, run until it runs out.

## Exercise

Set the fixture's backup density to 500 kg/m3 in the panel and confirm the allowable against the table, then step it down to 150 and to 0.

Divide the change in allowable between any two rows by the change in density between them, and check that you recover the sensitivity above.

Then say, in one sentence, what has to have happened in the well for the far side of a string to arrive at nearly zero.
