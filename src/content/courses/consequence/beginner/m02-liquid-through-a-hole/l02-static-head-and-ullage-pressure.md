# Static head and ullage pressure

{{panel:cq-release}}

The pressure at a hole in a liquid line has two parts. One is the static head: the weight of liquid standing above the hole. The other is the ullage pressure: whatever gas pressure sits on top of the liquid. The engine adds them to make the absolute pressure at the hole and subtracts ambient to get the driving pressure. This lesson sweeps each part with the other held, on the AMENAM crude line.

## The head, swept

With the pressure above the liquid held at 200000 Pa absolute:

| head m, stated | driving pressure Pa | mass rate kg/s |
| --- | --- | --- |
| 0 | 98675.000000 | 15.767020 |
| 1 | 107010.652500 | 16.419486 |
| 3 | 123681.957500 | 17.652215 |
| 6 | 148688.915000 | 19.354651 |
| 12 | 198702.830000 | 22.374228 |

The driving pressure climbs by the same step for every metre of head, because the head term rhoL g hL is linear in the height. The mass rate climbs more slowly, because it goes as the square root of the driving pressure. Doubling the head from 6 m to 12 m does not double the rate. The first row is worth a second look: with no head at all the line still flows, because the ullage alone sits above ambient.

## The ullage pressure, swept

With the head held at 6 m:

| pressure above the liquid Pa, stated | driving pressure Pa | mass rate kg/s |
| --- | --- | --- |
| 101325 | 50013.915000 | 11.225132 |
| 150000 | 98688.915000 | 15.768131 |
| 200000 | 148688.915000 | 19.354651 |
| 500000 | 448688.915000 | 33.621626 |
| 1000000 | 948688.915000 | 48.888640 |

Here the ullage dominates. From 200000 Pa to 1000000 Pa absolute the driving pressure grows many times over, and the rate again follows its square root. Notice the two rows that almost match across the tables: a head of 0 m with the ullage at 200000 Pa, and a head of 6 m with the ullage at 150000 Pa, give driving pressures of 98675.000000 and 98688.915000 Pa and nearly the same rate. Head and ullage pressure are interchangeable as far as the hole is concerned.

## The head alone, and Torricelli

Set the ullage to ambient, 101325 Pa, and the pressure above the liquid cancels against the air outside. The driving pressure is then the head alone, and Bernoulli reduces to Torricelli's result for a jet from an open tank, sqrt(2 g h). Derived at the AMENAM head it is 10.848032 m/s, against the engine's 10.848032. The density drops out of the velocity entirely: every liquid leaves an open tank at the same speed for the same head, and only the mass rate carries the density.

This is the check worth running whenever a liquid calculation looks strange. Put the ullage at ambient, read the velocity, and compare it with the square root of twice gravity times the head.

## Why both inputs are stated

A tank at atmospheric pressure and a pressurised vessel can hold the same liquid at the same level and leak at very different rates. The engine asks for both inputs because neither can be inferred from the other. The pressure above the liquid must be typed as absolute: typing a gauge figure leaves out one atmosphere and understates every row above.

## Exercise

On the outflow view, set the pressure above the liquid to 101325 Pa and the head to 6 m, and read the jet velocity against the Torricelli figure above. Then pick any two rows from the head ladder, divide their mass rates, and compare the result with the square root of the ratio of their driving pressures. Write one sentence on what the comparison shows.
