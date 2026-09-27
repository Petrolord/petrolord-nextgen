# The published tables

{{panel:marine-base-calculator}}

An engine that computes a queue should reproduce the queues its sources print. Three published sets of M/M/c figures run through this engine, and the course reads each as its source prints it, by table and example, alongside the engine's own figure.

## Adan and Resing, Table 5.1

Table 5.1 of Queueing Systems holds the occupation rate at 0.9 and the mean service time at 1, and prints the delay probability and the mean wait at 1, 2, 5, 10 and 20 servers. The golden inputs state a service of 1 fixed hour, a working day of 10 hours and 9, 18, 45, 90 and 180 arrivals a day, so every row runs at a berth utilisation of 0.900000.

| berths | delay probability (engine) | printed | mean wait (engine) | printed |
| --- | --- | --- | --- | --- |
| 1 | 0.900000 | 0.90 | 9.000000 | 9.00 |
| 2 | 0.852632 | 0.85 | 4.263158 | 4.26 |
| 5 | 0.762493 | 0.76 | 1.524986 | 1.53 |
| 10 | 0.668732 | 0.67 | 0.668732 | 0.67 |
| 20 | 0.550769 | 0.55 | 0.275385 | 0.28 |

The table teaches pooling: at the same occupation, twenty servers sharing one queue wait a small fraction of what one server waits. Every printed figure is the engine's rounded to two decimals except one, at five servers, which the next lesson reads.

## Adan and Resing, Table 5.2

Table 5.2 holds the surplus capacity at 0.1 of a server, so the occupation rises with the servers. The golden inputs state 9, 19, 49, 99 and 199 arrivals a day.

| berths | berth utilisation (engine) | printed rho | mean wait (engine) | printed | mean in the system (engine) | printed |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.900000 | 0.90 | 9.000000 | 9.00 | 9.000000 | 9 |
| 2 | 0.950000 | 0.95 | 9.256410 | 9.26 | 19.487179 | 19 |
| 5 | 0.980000 | 0.98 | 9.503169 | 9.50 | 51.465529 | 51 |
| 10 | 0.990000 | 0.99 | 9.637384 | 9.64 | 105.310104 | 105 |
| 20 | 0.995000 | 0.995 | 9.737327 | 9.74 | 213.672804 | 214 |

Holding the spare capacity fixed holds the wait nearly steady while the occupation climbs toward 1. Every printed figure is the engine's rounded, to two decimals for the wait and to a whole number for the mean in the system.

## Iversen, Example 12.3.1

Iversen's handbook prints two delay systems: 32 channels with a mean service of 100 s at 20 erlang, and 5 channels with 10 s at 2 erlang, with mean waits of 0.075 s and 0.199 s, 0.274 s in total. The golden inputs read the second as the working hour, which changes no figure because every time in the call is in the same unit.

| system | offered load (engine) | delay probability (engine) | mean wait (engine) | printed |
| --- | --- | --- | --- | --- |
| first | 20.000000 | 0.008964 | 0.074697 | 0.075 |
| second | 2.000000 | 0.059701 | 0.199005 | 0.199 |

The two engine waits add to 0.273702, which rounds to the printed 0.274. The large system waits less although its calls are ten times longer: pooling again.

## Putting a textbook row into the calculator

A textbook states servers, an occupation rate and a service time; the calculator asks for berths, arrivals a day, a working day and service terms. The translation is arithmetic: a service of 1 fixed hour with no lifts and no bulk, a working day chosen once, and the arrivals a day set so that the berth utilisation equals the occupation the table states. Any working day would do, provided the arrivals follow it.

## Why this matters for a base

The lesson each table teaches carries straight to the quay: one shared queue across the berths waits less than separate queues at each.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Adan and Resing Table 5.1, five servers". Read the Probability of waiting and Mean wait, hours tiles. Set Berths (stated) to 2 and Arrivals a day (stated) to 18, and check the row for two servers. Then start from "Adan and Resing Table 5.2, twenty servers" and read the Mean in the system tile, and from "Iversen Example 12.3.1, system one" and "system two", adding the two mean waits yourself.
