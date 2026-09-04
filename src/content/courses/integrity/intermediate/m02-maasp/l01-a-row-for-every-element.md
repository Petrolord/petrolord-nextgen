# A row for every element

The table is the answer. The single number at the bottom is a summary of it.

{{panel:wi-annulus-explorer}}

## One element, one row

Every limiting element you hand in produces its own row, and that row is complete in itself:

    { name, kind, factor, limitPa, tvdM, backupDensityKgM3, allowSurfacePa }

`allowSurfacePa` is that element's own answer to the question. If this annulus had only this element bounding it, this is the surface pressure it would allow.

Rows do not interact. Change one element's rating, or its depth, or the fluid on its far side, and only its own row moves. That independence is what makes the table readable: you can attribute any change in the final number to one line.

## What a row is made of

Two terms, and the next two lessons take one each:

    allowSurfacePa = factor * limitPa
                     - (annulusFluidDensity - backupDensity) * g * tvdM

The first term is what the element is rated to carry, derated. The second is the load the standing fluid columns already put on it. What is left over is what surface pressure may add.

## The published rows

Three candidates on one annulus at 1200 kg/m3:

| name | factor | limit, Pa | TVD, m | backup, kg/m3 | allowable, Pa |
|---|---|---|---|---|---|
| 9-5/8 production casing burst | 0.5 | 40000000 | 1435.457478934607 | 1030 | 17606905.05541501 |
| 7 in production liner burst | 0.8 | 35000000 | 1167.3419238429642 | 1100 | 26855228.63225454 |
| 4-1/2 tubing collapse | 0.75 | 25000000 | 997.0400302755012 | 500 | 11905664.170969129 |

Three depths, three backups, three factors. Nothing in that table is shared between rows except the annulus fluid, which is the one property the annulus itself owns.

## Order, and what the engine will refuse

Rows come back in the order you supplied. The engine does not sort them, so the top row is not the important one and position carries no meaning at all.

It does refuse bad rows. A limit that is not above zero throws, naming the element. A negative TVD throws. A factor outside the interval from just above zero to 1 throws. An annulus density that is not positive throws before any row is built, and an empty element list throws as well, because an annulus with no bounding elements has no limit to report.

## Exercise

In the panel, change the 7 in liner rating and confirm that only its own row moves.

Then add a wellhead element at zero depth and predict its allowable before you read it.
