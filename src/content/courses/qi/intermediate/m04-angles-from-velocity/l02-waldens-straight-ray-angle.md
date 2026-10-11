# Walden's straight-ray angle

A gather records offsets; AVO is read in angles. Walden's (1991, Geophysical Prospecting 39) straight-ray angle gives each offset an incidence angle from the two velocities the last lesson put on the trace clock, the RMS velocity and the interval velocity at the zero-offset time.

{{video:qi-d12}}

## The equation

`waldenAngle` returns

sin(theta) = (Vint / Vrms) x / sqrt(x^2 + (Vrms t0)^2)

with x the offset and t0 the zero-offset time. The second factor is the sine of a straight ray through a medium at the RMS velocity; the ratio Vint / Vrms scales it to the velocity of the layer the ray arrives through. Past a sine of one the engine returns 90 degrees.

Two things follow from the form. The angle grows with offset and shrinks with time, so the same offset reaches a smaller angle deeper down. And it grows with Vint / Vrms, so a fast layer under slower ones reaches large angles at modest offsets.

## How far a straight ray is from the real one

The course tests the approximation on a designed flat-layer teaching earth of four layers: 600 m at 1800 m/s, 600 m at 2200 m/s, 500 m at 2600 m/s and 400 m at 3000 m/s. `layeredRms` gives the RMS velocity and time at each base, and `rayTraceAngle` traces the exact ray by Snell's law, with the ray parameter solved for the offset. At the base of the third layer (t0 1596.736597 ms, Vrms 2152.777869 m/s, Vint 2600 m/s):

| offset m | Walden degrees | ray trace degrees | Walden less ray trace |
| --- | --- | --- | --- |
| 500 | 10.011520 | 10.002038 | 0.009482 |
| 1000 | 19.716435 | 19.640730 | 0.075705 |
| 1500 | 28.884086 | 28.628580 | 0.255506 |
| 2000 | 37.400033 | 36.790963 | 0.609071 |
| 2500 | 45.265069 | 44.057814 | 1.207256 |
| 3000 | 52.574313 | 50.430992 | 2.143321 |

Walden reads high at every offset here, and the excess grows with offset: under a hundredth of a degree at 500 m, over two degrees at 3000 m. At far offsets the straight ray places a trace at a higher angle than the exact ray, which matters most for the gradient, the change of amplitude across angle.

## On the Ekene table

At the top of gather 5 (1292.000000 ms), with the RMS velocity 2388.940541 m/s and the sand's interval velocity 2885.878392 m/s:

| offset m | Walden degrees |
| --- | --- |
| 500 | 11.138104 |
| 1000 | 21.859471 |
| 1500 | 31.872141 |
| 2000 | 41.065011 |
| 2500 | 49.493998 |

At the same offsets these angles are larger than in the teaching earth: the top of the Ekene Sand is earlier in time, and the product Vrms t0 in the denominator is the smaller there. The gathers are muted to exact zeros beyond 40 degrees, and at the top Walden's angle passes 40 degrees between the 1500 m and 2000 m rows, so the farthest offsets at the target carry the mute.

## What the angle rests on

Every figure above depends on the velocity table, the time it is read at and the straight-ray assumption. A study states the table and the time, and says that its angles are Walden's. The Rock Physics course reads the reflection coefficient at an angle; this course supplies the angle from the seismic.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the Angles from velocity view and choose the designed four-layer teaching earth. Set the zero-offset time to the base of the third layer and step the offset from 500 m to 3000 m, comparing Walden's angle with the ray-traced one. Then switch the source to the Ekene pack's RMS velocity table, set the time to 1292 ms, and find the offset at which Walden's angle first passes 40 degrees. Move the time later and say which way that offset moves.
