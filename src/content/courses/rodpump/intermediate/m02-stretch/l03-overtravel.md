# Overtravel

The marched plunger stroke is longer than the spring rule allows, at every speed on the published taper, because the rod string is still moving when the polished rod turns round.

{{panel:pd-card-explorer}}

## Two routes to one quantity

The spring rule is `S - Fo Er`, a static subtraction that returns 45.279814701 in on the published taper whatever the speed. The wave march is `predictCard`'s `plungerStrokeIn`, the peak to trough travel of the pump end node over one settled cycle. Overtravel is the second minus the first, and the wave answer is the longer one at every speed on the published taper.

Inertia is the reason. The polished rod reverses at the top and at the bottom of its stroke, but the mass of rod below it has momentum and keeps going for a moment. The static rule has no term for mass, so it cannot see this.

## The ladder, contiguous through a working range

| Speed, spm | Wave march, in | Overtravel, in | Percent of the rule |
| --- | --- | --- | --- |
| 5.0 | 45.449104154 | 0.169289454 | 0.373874 |
| 6.0 | 47.273834560 | 1.994019860 | 4.403772 |
| 7.0 | 45.614176457 | 0.334361756 | 0.738434 |
| 8.0 | 47.050606975 | 1.770792274 | 3.910776 |
| 9.0 | 49.670227367 | 4.390412667 | 9.696181 |
| 10.0 | 51.092131595 | 5.812316894 | 12.836441 |

At the bottom of the same ladder, 0.5 spm gives 45.286791250 in, an overtravel of 0.006976549 in or 0.015408 percent. At the top, 15 spm gives 53.042713176 in, 7.762898475 in of overtravel or 17.144281 percent.

## Read the ragged rows, do not delete them

The 7.0 spm row steps back below the 6.0 spm row, and the 8.0 spm row climbs again. That is not an error and it is not noise in the reported figure. The settled cycle a march lands on depends on where the valve transfers fall relative to the wave arriving back from the pump, and that phase is not a smooth function of speed.

So overtravel grows with speed in the large, from 0.015408 percent to 17.144281 percent, and does not grow monotonically in the small. A writer who quotes 5.0, 6.0 and 9.0 spm and calls it a trend has picked three rows out of a ladder that steps back twice inside them.

## Inertia, tested rather than asserted

If overtravel is inertia, it should grow as the load carried grows relative to the string's stiffness. Walking the fluid load on the published taper at 9 spm gives 3.020373 percent at 1000.0 lb, 1.439066 at 2000.0, 3.521722 at 3000.0, 6.882029 at 4000.0, 9.696181 at 5000.0, 12.259465 at 6000.0, 12.785687 at 7000.0 and 6.280545 at 8000.0.

The trend is there and the last two rows break it. The percentage stalls at 7000.0 lb and collapses at 8000.0, for the same reason the speed ladder is ragged: the phase of the transfers moves too.

## Exercise

Read the wave march at 6.0, 7.0 and 8.0 spm in the panel and write the three overtravels in inches.

Then say in one sentence why quoting only the 5.0, 9.0 and 10.0 spm rows would misrepresent the ladder.
