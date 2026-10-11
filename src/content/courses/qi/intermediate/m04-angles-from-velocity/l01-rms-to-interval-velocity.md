# RMS to interval velocity

An offset becomes an angle only through a velocity, and the gathers come with an RMS velocity table, an average over every layer from the surface down. The angle at a reflector needs the velocity of the layer the ray arrives through, so the first step turns the RMS table into interval velocities with Dix's equation, and the second puts both on the trace clock.

## Dix's equation in the engine

`dixInterval` takes two rows of an RMS velocity table, each a two-way time and an RMS velocity, and returns the velocity of the interval between them:

Vint^2 = (Vrms2^2 t2 - Vrms1^2 t1) / (t2 - t1)

The first row's interval velocity is its RMS velocity. When a deeper row's RMS velocity falls fast enough, the numerator is negative, no real velocity has that square, and the engine refuses, naming the time. A designed table built to fall too fast gives:

> The RMS velocities give no real interval velocity at 1.1 s.

## The pack's table

The pack carries the kit's published RMS velocity table for the gathers next to Ekene-1. Its Dix interval velocities:

| two-way time ms | RMS velocity m/s | interval velocity m/s |
| --- | --- | --- |
| 46.700000 | 1500.000000 | 1500.000000 |
| 330.600000 | 1974.900000 | 2042.470033 |
| 925.500000 | 2458.300000 | 2689.639308 |
| 1040.500000 | 2455.800000 | 2435.587010 |
| 1288.800000 | 2387.600000 | 2077.601943 |
| 1311.000000 | 2396.900000 | 2885.878392 |
| 1516.500000 | 2352.200000 | 2044.152876 |
| 1571.700000 | 2340.500000 | 1992.374462 |
| 1624.800000 | 2346.700000 | 2523.323799 |
| 1782.300000 | 2328.600000 | 2132.930307 |

The RMS column changes slowly below the row at 925.500000 ms, and the interval column swings widely. The row at 1288.800000 ms sits at the top of the Ekene Sand in time (the checkshot top at Ekene-1 is 1288.796378 ms), and the next row, 1311.000000 ms, closes a thin interval at 2885.878392 m/s: the sand. Above it the interval from 1040.500000 to 1288.800000 ms runs at 2077.601943 m/s, the slower shale. A small change in RMS velocity over a short time is a large change in interval velocity, so Dix sees the contrast that makes the top a peak, and a small picking error in a thin interval becomes a large error in the velocity the angle reads.

## On the trace clock

`velocityOnGrid` puts the table on every sample of a trace. The RMS velocity is linear in time between rows and held flat outside the table; the interval velocity at a sample is the Dix velocity of the row segment the sample falls in, so it steps at each row.

| at 1292.000000 ms | m/s |
| --- | --- |
| RMS velocity | 2388.940541 |
| interval velocity | 2885.878392 |

1292.000000 ms is the top of the Ekene Sand picked on gather 5, the gather on the trace of Ekene-1. The picked time falls just below the row at 1288.800000 ms, so its interval velocity is the sand's, and its RMS velocity lies between the two rows that bracket it. That RMS velocity is also the NMO velocity the stretch at the top was read with.

## What a study states

The table is an input: which table, which rows, and what the study did with a row that Dix refused. The angle in the next lesson inherits every one of those choices.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the Angles from velocity view on the Ekene pack's RMS velocity table. Check the interval column against the table above, then set the sample time to 1292 ms and read the RMS and interval velocities on the trace clock. Move the time across the row at 1311.000000 ms and watch the interval velocity step while the RMS velocity moves smoothly. Finally edit one RMS velocity in the table downwards until the view refuses, and record the time the refusal names.
