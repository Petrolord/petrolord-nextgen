# The twenty percent

Twenty percent is not a rounding and it is not a tolerance. It is the size of a decision that gets made once and then priced into every rate that follows.

{{panel:pd-droplet-explorer}}

## Exactly 1.200000, on every published row

The published velocity table crosses two fluids with three pressures and two temperatures. On all twelve rows the Turner velocity divided by the Coleman velocity is 1.200000000000.

| Published row | Coleman, ft/s | Turner, ft/s | Coleman rate, Mscf/d | Turner rate, Mscf/d |
| --- | --- | --- | --- | --- |
| 1 | 12.1435923634 | 14.5723108360 | 744.079205867 | 892.895047041 |
| 2 | 13.0189530541 | 15.6227436649 | 694.784496129 | 833.741395355 |
| 3 | 6.5866393859 | 7.9039672631 | 1345.285990329 | 1614.343188395 |
| 4 | 7.0706235386 | 8.4847482463 | 1257.796893536 | 1509.356272243 |
| 5 | 4.0737980096 | 4.8885576115 | 2080.128829231 | 2496.154595078 |
| 6 | 4.3868983237 | 5.2642779885 | 1950.969053065 | 2341.162863678 |

The rates are those rows converted through 2.441 in at their own stations. The percentage difference is 20.00000000 on every one of them, because the rate is linear in the velocity once the station and the area are fixed. Twenty percent of a velocity is twenty percent of a rate.

## What twenty percent is worth in Mscf/d

Percentages are easy to wave through. The same gap in production units is not. On published row 5 the two correlations are 416.025765846 Mscf/d apart. On row 7 they are 102.159252960 Mscf/d apart. On row 11, 280.563074824 Mscf/d. The bigger the well, the bigger the gap, because it is a fixed fraction of a number that grows.

A well flowing between the two answers is healthy under one published correlation and loaded under the other, on the same day, with the same gauge reading, the same tubing and the same water.

## The mistake

Treating the 1.200000 as a safety factor. It is not adjustable and it is not a margin. It does not vary with pressure, with fluid or with tubing size: 1.200000 at 300.0 psia and 1.200000 at 2500.0 psia, on water and on condensate alike.

Dropping it to be less conservative, or applying it twice to be more so, does not move the answer along a scale of caution. It substitutes a different published fit, or no published fit at all.

## What it refuses

The adjustment is a stored constant. Nothing in the module derives it, tunes it, or checks it against the well in hand, and no output field records how much of a critical rate came from the balance and how much came from the multiplier.

So the twenty percent is invisible downstream. A critical rate of 1614.343188395 Mscf/d and one of 1345.285990329 Mscf/d look equally like measurements by the time they reach a report.

## Exercise

Take any published row in the panel, read both critical rates, and write their difference in Mscf/d. Then say which of the two you would have to defend if the well were shut in on the strength of it.
