# RMS to interval velocity

An offset becomes an angle only through a velocity, and the gathers come with an RMS velocity table, an average over every layer from the surface down. The angle at a reflector needs the velocity of the layer the ray arrives through, so the first step turns the RMS table into interval velocities with Dix's equation, and the second puts both on the trace clock.

## Dix's equation in the engine

`dixInterval` takes two rows of an RMS velocity table, each a two-way time and an RMS velocity, and returns the velocity of the interval between them:

Vint^2 = (Vrms2^2 t2 - Vrms1^2 t1) / (t2 - t1)

The first row's interval velocity is its RMS velocity. When a deeper row's RMS velocity falls fast enough the numerator is negative, and the engine refuses, naming the time. A designed table built to fall too fast gives:

> The RMS velocities give no real interval velocity at 1.1 s.

## The pack's table

The kit's published RMS velocity table for the gathers, with its Dix interval velocities:

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

The RMS column changes slowly below the row at 925.500000 ms, and the interval column swings widely. The row at 1288.800000 ms lies at the checkshot top of the Ekene Sand at Ekene-1, 1288.796378 ms, and the next row, 1311.000000 ms, lies by the checkshot level next to the base, 1311.086000 ms. The interval between them runs at 2885.878392 m/s, the fastest on the table. Above it the interval from 1040.500000 to 1288.800000 ms runs at 2077.601943 m/s. Across those rows the RMS velocity moves from 2387.600000 to 2396.900000 m/s, while the interval velocity jumps from 2077.601943 to 2885.878392 m/s.

## On the trace clock

`velocityOnGrid` puts the table on every sample of a trace. The RMS velocity is linear in time between rows and held flat outside the table; the interval velocity at a sample is the Dix velocity of the row segment the sample falls in, so it steps at each row.

| at 1292.000000 ms | m/s |
| --- | --- |
| RMS velocity | 2388.940541 |
| interval velocity | 2885.878392 |

1292.000000 ms is the top picked on gather 5. The picked time falls just below the row at 1288.800000 ms, so its interval velocity is that of the segment to 1311.000000 ms, and its RMS velocity lies between the two rows that bracket it. That RMS velocity is also the NMO velocity the stretch at the top was read with.

## What a study states

The table is an input: which table, which rows, and what the study did with a row that Dix refused. The angle in the next lesson inherits every one of those choices.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Dix and Walden". Check the Dix interval velocity column against the table above, then choose rows in Dix layer ending at and read the tile for each layer. Set Time to 1292 ms and read RMS velocity at the time and Interval velocity at the time. Step Time a few milliseconds either side of the row at 1311.000000 ms and watch the interval velocity step while the RMS velocity moves smoothly. Finally find the layer below 925.500000 ms with the highest interval velocity and set its two rows beside Ekene-1's checkshot times at the top and the base of the sand.
