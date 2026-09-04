# The curves that define a stage

Three curves define a stage, and the vendor publishes two of them.

{{panel:pd-stage-explorer}}

## What the vendor actually gives you

The published golden vendor curve is five points off a manufacturer sheet, each with a head and an efficiency, at a reference frequency of 60 Hz on a curve fluid of specific gravity 1.0.

| Rate, bbl/d | Head, ft | Efficiency, percent |
| --- | --- | --- |
| 1500 | 32.0000 | 55.00 |
| 2000 | 30.5000 | 68.00 |
| 2500 | 28.0000 | 74.00 |
| 3000 | 24.0000 | 72.00 |
| 3500 | 19.0000 | 65.00 |

Head falls all the way across, from 32.0000 ft to 19.0000 ft. Efficiency climbs to 74.00 percent at 2500 bbl/d and then falls back to 65.00 percent. The published range is 1500 to 3500 bbl/d, which is the two end rates and nothing more: it is a statement about where the vendor measured, not about where the pump can run.

## The third curve is derived

Brake power fit present is false on this curve. No vendor power points were given, so power per stage is computed from head and efficiency at the pumped gravity rather than read, which means the power reading depends on the efficiency transcription in a way head does not.

## Gravity moves power and moves nothing else

| Rate, bbl/d | Head, ft | Efficiency | Power at SG 1.00, hp | Power at SG 0.90, hp |
| --- | --- | --- | --- | --- |
| 1500 | 31.985714 | 0.54942857 | 0.64381596 | 0.57943436 |
| 2500 | 27.914286 | 0.73657143 | 0.69851755 | 0.62866580 |
| 3500 | 18.985714 | 0.64942857 | 0.75437842 | 0.67894058 |

Head and efficiency are identical down both fluids. Only the power column moves, because gravity enters the power statement and nothing else.

## The mistake

Expecting brake power to be lowest where efficiency is highest. Power at specific gravity 1.00 climbs from 0.64381596 hp at 1500 bbl/d to 0.75437842 hp at 3500 bbl/d without turning over, and it is still climbing at 3500 bbl/d where efficiency has already fallen to 0.64942857 fraction. Rate rises faster than head and efficiency fall, so the product keeps growing. A stage at its best efficiency is not a stage drawing its least power, and a motor sized off the wrong end of that curve is undersized.

## What it refuses

The curve refuses to say anything about a fluid it was not measured on beyond the gravity scaling in the power. It carries no vendor power points, so where efficiency is missing there is no power reading at all. And it makes no claim outside 1500 to 3500 bbl/d, though it will still answer there.

## Exercise

Read head, efficiency and brake power per stage at 1500, 2500 and 3500 bbl/d at 60 Hz in the panel, first on a specific gravity of 1.00 and then on 0.90.

Write down which of the three columns changed, then say which published point carries the highest efficiency and which carries the highest power.
