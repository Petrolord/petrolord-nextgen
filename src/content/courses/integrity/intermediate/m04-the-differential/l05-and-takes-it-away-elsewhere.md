# And takes it away elsewhere

The column you just weighted up to protect one string is standing on the inside of another. The same fluid appears twice in the well, with opposite signs.

{{panel:wi-annulus-explorer}}

## The same fluid, the other sign

An annulus has two walls. The fluid in it is the backup for the string inside it, where it enters the row as `backupDensityKgM3` and adds, and the annulus fluid for the string outside it, where it enters as `annulusFluidDensityKgM3` and subtracts. The engine applies both without comment, because each row is only asked about its own wall.

## The cost, at the same rate

Hold an element at a factor of 0.8 on a limit of 30000000 Pa, at a TVD of 2048.29303343 m, with 1030 kg/m3 backing it, and raise the fluid in its own annulus:

| Annulus density, kg/m3 | Allowable surface pressure, Pa |
| --- | --- |
| 1030 | 24000000 |
| 1200 | 20585228.21103133 |
| 1600 | 12550471.060516804 |
| 2200 | 498335.3347450197 |
| 2250 | -506009.3090692945 |

The slope is -20086.892876286307 Pa per kg/m3, equal in size and opposite in sign to the gain in the previous lesson. Going from 1030 kg/m3 to 1200 kg/m3 costs 3414771.788968672 Pa here, exactly what it bought there.

Keep going and the element runs out. The crossing is at 2224.8089805533505 kg/m3, and the 2250 kg/m3 row is negative and clamped to zero.

## No free margin, only a choice

The two effects cancel only when the two elements sit at the same true vertical depth, because the slope is g multiplied by TVD and nothing else.

They usually do not. On the published well the candidates sit at 1435.457478934607 m, 1167.3419238429642 m and 997.0400302755012 m, so a weight up is worth more to the deeper element than it costs the shallower one, or the reverse, depending on which side of the column each element sits.

That is the whole of the design question. Choosing a fluid does not create margin, it moves margin from one wall to another, and the only reason to move it is that one wall needs it more.

## How to make the choice

Move it towards the element you can least afford to lose and least easily inspect, away from the one whose allowable already has room above the pressures you expect. Then check every element in the well after the change, not only the one you were trying to help.

## Exercise

Reproduce the table and confirm the crossing at 2224.8089805533505 kg/m3.

Then propose a weight up for one annulus of the published well and list every candidate it would move, with the sign of each move.
