# Power per stage

The published vendor curve carries no power points at all. Every horsepower in this course is built out of the head reading and the efficiency reading.

{{panel:pd-stage-explorer}}

## Built, not read

The golden vendor curve records that a brake power fit is not present, so with no vendor power points the brake power per stage is derived from head and efficiency at the pumped gravity. The rate, the head and the specific gravity go through HP_HEAD_DIVISOR, 135635.80083124, and the efficiency divides the result.

The pressure form of the same statement is hp equal to rate times pressure rise over 58824. The exact divisor of this package carried into pressure units is 58775.513694, sitting 0.0008242606 in relative terms from that familiar rounded 58824.

## Gravity moves power and nothing else

| Rate, bbl/d | Head, ft | Efficiency | hp at SG 1.00 | hp at SG 0.90 |
| --- | --- | --- | --- | --- |
| 1500 | 31.985714 | 0.54942857 | 0.64381596 | 0.57943436 |
| 2000 | 30.557143 | 0.68228571 | 0.66039249 | 0.59435324 |
| 2500 | 27.914286 | 0.73657143 | 0.69851755 | 0.62866580 |
| 3000 | 24.057143 | 0.72228571 | 0.73668519 | 0.66301667 |
| 3500 | 18.985714 | 0.64942857 | 0.75437842 | 0.67894058 |

The head column and the efficiency column are identical for both fluids. Only the horsepower columns move.

## Power rises while head falls

Head goes from 31.985714 ft down to 18.985714 ft across the published range while brake power per stage goes from 0.64381596 hp up to 0.75437842 hp on a 1.00 specific gravity fluid. Rate climbs faster than head drops, so the highest power draw in the published range sits at its high end and not at the best efficiency point.

Speed moves it hardest of all. Held at 2500 bbl/d the same stage takes 0.1984706437 hp at 40 Hz, 0.3836902045 at 50 Hz, 0.6286657970 at 60 Hz and 0.9579193256 hp at 70 Hz on a 0.90 specific gravity fluid.

## The mistake

Reading a horsepower off a curve sheet without checking which fluid it was drawn for. At 1500 bbl/d the answer is 0.64381596 hp on water and 0.57943436 hp on a 0.90 gravity fluid, a gap of about a tenth of the number, repeated at every stage and again at the motor.

## What it refuses

Brake power at zero efficiency is NaN, because efficiency divides. With no efficiency fit at all the head at 2500 bbl/d still reads 27.914286 ft and the brake power is NaN, so a missing efficiency shows up in the power and nowhere else. Power per stage is also not a motor load: nothing in the reading knows how many stages there are or what the motor is rated for.

## Exercise

Read brake power per stage at 1500, 2500 and 3500 bbl/d at 60 Hz on both fluids and write the six numbers with the head and efficiency at each rate.

Then say which columns moved, and why.
