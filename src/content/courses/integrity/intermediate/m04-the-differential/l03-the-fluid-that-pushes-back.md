# The fluid that pushes back

Put something heavier on the far side of the wall and the allowable pressure on this side goes up. The relationship is exactly linear and you can read its slope straight off the sweep.

{{panel:wi-annulus-explorer}}

## The slope

For an element at a TVD of 2048.29303343 m, every extra kg/m3 of backup density is worth 20086.892876286307 Pa of allowable surface pressure.

That is the whole of the sensitivity. It does not depend on the limit, on the factor or on how much backup you already have. It is g multiplied by the true vertical depth, so it is fixed once the element is fixed.

The annulus side carries the same slope with the opposite sign. Every extra kg/m3 in the annulus is worth -20086.892876286307 Pa.

## Reading it on the sweep

Hold the factor at 0.8 and the limit at 30000000 Pa, keep 1200 kg/m3 in the annulus, and raise the backup density:

| Backup density, kg/m3 | Allowable surface pressure, Pa |
| --- | --- |
| 0 | -104271.45154356956 |
| 500 | 9939174.986599585 |
| 1030 | 20585228.21103133 |
| 1200 | 24000000 |
| 1500 | 30026067.862885892 |
| 2000 | 40069514.30102905 |

At 1200 kg/m3 the two sides balance, the head vanishes and the allowable is the rated term exactly. Above that the head is negative and it adds. At 2000 kg/m3 the element allows 40069514.30102905 Pa, which is more than the unfactored limit of 30000000 Pa.

That is not a bug. A wall with a much heavier column outside it really can take more pressure inside before the difference across it reaches the rating. It is also the point at which you must be able to defend the backup column, because the entire excess above the rating rests on it staying there.

## Where a row crosses zero

Walk the other way and the allowable runs out. On the annulus side, with 1030 kg/m3 behind the wall, the row reaches 498335.3347450197 Pa at 2200 kg/m3, and at 2250 kg/m3 it is -506009.3090692945 Pa and clamped to zero.

The crossing is at an annulus density of 2224.8089805533505 kg/m3. Weight the annulus past that and this element has no operating envelope left at surface.

The backup side has its own crossing. Holding 1200 kg/m3 in the annulus, the row turns positive at a backup density of 5.191019446649534 kg/m3, which is why a blank field and a light gas column are not the same statement.

## Exercise

Confirm the slope by taking any two rows in the table and dividing the change in allowable by the change in density.

Then predict the allowable at a backup density the sweep does not list, and check it in the panel.
