# A weighted memory

{{panel:dq-monitor-explorer}}

The EWMA chart plots a running average that remembers. Each day it takes lambda of the new reading and 1 - lambda of yesterday's EWMA: EWMA_t = lambda x_t + (1 - lambda) EWMA_(t-1), starting at EWMA_0 = the target. On EKENE-3's monitored pressure, with lambda 0.2 and a target of 611.380000 psig from phase one, day 1 reads 615.500000 psig and the EWMA moves to 612.204000. Day 2 reads 608.900000 and the EWMA moves to 611.543200.

| day | pressure, psig | EWMA, psig |
| --- | --- | --- |
| 1 | 615.500000 | 612.204000 |
| 2 | 608.900000 | 611.543200 |
| 3 | 613.800000 | 611.994560 |
| 4 | 614.900000 | 612.575648 |
| 5 | 612.000000 | 612.460518 |

## Where the memory comes from

Unroll the recursion and each past reading keeps a weight that shrinks by a factor of 1 - lambda each day. A reading enters with weight lambda and never quite leaves. On EKENE-3, derived: day 8's reading enters the EWMA with weight lambda, 0.200000, and on day t it keeps lambda (1 - lambda)^(t - 8), which is 0.065536 on day 13. That is why a single reading moves the EWMA only part of the way, and why a run of readings on one side moves it steadily.

## The NIST example

NIST/SEMATECH 6.3.2.4 works an EWMA with lambda 0.3 and a target of 50. The engine's first five EWMA values on that data are 50.600000, 49.520000, 50.564000, 50.184800 and 50.159360. The golden that anchors the engine carries this example, and the course reads NIST's printed limits against the engine in the last module.

## What the glitch does to a memory

Day 8 on EKENE-3 is the planted glitch, 633.800000 psig. The EWMA jumps from 613.646732 to 617.677385 and signals above its upper limit of 615.154063. On day 9 the reading is back at 608.000000, and the EWMA still reads 615.741908 and still signals: the glitch is remembered. By day 10 it reads 614.813527 and is inside. Days 13 and 14 signal high again at 615.375726 and 615.440581, after days 12 and 13 read 618.000000 and 619.500000 on top of what remained of day 8. One wild day costs an EWMA chart more than one signal, and a monitoring note reads the EWMA signals in the light of the individuals chart, which shows day 8 alone.

## What the memory is for

The glitch is the price of the memory; the shift is its purpose. From day 16 the pressure sits lower by a planted 1.2 process standard deviations, and no single shifted day need be extreme. The EWMA gathers them. It first signals low on day 22, at 606.394191, and it signals low on every day from day 27 to day 34. The individuals chart, drawn on the same standard, signals low on one day of that stretch.

## lambda at its ends

At lambda 1 the EWMA is the observation itself, with no memory, and the chart is the individuals chart. A small lambda remembers long and moves slowly. Lesson four sets the two ends beside each other on EKENE-3's forty days.

## Exercise

Start from day 1's EWMA, 612.204000, and day 2's reading, 608.900000. Compute day 2's EWMA with lambda 0.2 and check your answer against 611.543200. Carry the calculation on to day 3 with its reading of 613.800000. Then open the panel's EWMA view and confirm your figures, and read off the first day the EWMA falls below its lower limit.
