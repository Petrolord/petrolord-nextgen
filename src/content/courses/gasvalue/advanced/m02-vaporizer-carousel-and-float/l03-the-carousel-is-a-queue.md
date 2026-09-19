# The carousel is a queue

KANO fills its cylinders on a carousel of filling positions. `bottlingPlant` sizes it as a queue. The carousel is the loading-rack queue (Erlang C) run on the positions wholly working. lpgCng calls the loading-rack queue in terminalDepot for its carousel and its forecourt, and does not write a queue of its own. In this academy, that queue is taught in the supply course (`supply`).

{{panel:gasvalue-rollout-explorer}}

## KANO's carousel

KANO fills 3200 cylinders over a 10 hour shift, 2.2 minutes a cylinder, on 18 positions each available 0.92 of the time. All invented.

| field | value |
| --- | --- |
| arrivalsPerHour | 320.0000 |
| effectivePositions | 16.5600 |
| queuePositions | 16 |
| minimumPositionsForThroughput | 13 |
| queue offered (erlangs) | 11.7333 |
| queue utilisation | 0.7333 |
| queue probabilityOfWaiting | 0.1769 |
| queue averageWaitMinutes | 0.0912 |
| queue queueLength | 0.4866 |
| throughputCapacityPerDay | 4516.3600 |
| meetsDemand | true |

## The arrivals and the load

The demand, 3200 cylinders over a 10 hour shift, arrives at 320.0000 an hour. At 2.2 minutes a cylinder, the queue is offered 11.7333 erlangs. The engine prints both figures on the result, the first as arrivals and the second under the queue.

## The servers

The queue runs on queuePositions, 16. That count comes from the 18 positions and their availability of 0.92: effectivePositions is 16.5600, and the queue takes the whole positions wholly working, 16. The next lesson reads that step closely.

## How busy, and how long a wait

The queue returns four figures. Utilisation is 0.7333. The probability that a cylinder waits is 0.1769. The average wait is 0.0912 minutes. The queue length is 0.4866.

The engine's note on this carousel separates two numbers that are easy to run together: "Availability reduces the positions that are working; utilisation is how busy the working ones are. They are different numbers and a plant sized on one alone comes up short."

So KANO's carousel carries two fractions. The availability, 0.92, is an input and acts on the positions. The utilisation, 0.7333, is an output and describes the 16 working positions under the load.

## Capacity and demand

throughputCapacityPerDay is 4516.3600 cylinders. meetsDemand is true against the 3200 KANO fills. minimumPositionsForThroughput is 13. The capacity uses the unrounded effective positions, 16.5600, as the engine's rounding note says.

## The count moves the wait

The same carousel run on other whole numbers of positions, with availability set to 1 so the count is the count typed:

| positions (input) | probabilityOfWaiting | averageWaitMinutes |
| --- | --- | --- |
| 16 | 0.1769 | 0.0912 |
| 17 | 0.1078 | 0.0450 |
| 18 | 0.0633 | 0.0222 |

The 16 row prints the same two figures as KANO's queue, 0.1769 and 0.0912. KANO's queue runs on 16 working positions, and the 16 row runs on 16 positions typed at availability 1. At 17 positions they print 0.1078 and 0.0450. At 18 they print 0.0633 and 0.0222.

## The studio's carousel

The LPG & CNG Rollout Studio opens on its own carousel: 2400 a day, 2.5 minutes, 16 positions at 0.9, 8 hours. It prints effectivePositions 14.4000, queuePositions 14 and averageWaitMinutes 0.9850.

In practice, the bottling line's own records supply the fill time, the shift and the availability that a study types into the carousel.

## In the explorer

Open KANO's carousel and read the queue fields. Set the availability to 1 and the positions to 17, then 18, and read the probability of waiting and the average wait each time.

## Exercise

Read KANO's carousel: arrivalsPerHour 320.0000, offered 11.7333 erlangs, queuePositions 16, utilisation 0.7333, probabilityOfWaiting 0.1769, averageWaitMinutes 0.0912, throughputCapacityPerDay 4516.3600 and meetsDemand true. Using the engine's note, say which of the fractions 0.92 and 0.7333 acts on the positions and which describes the working ones. Then read the 16, 17 and 18 rows and quote the average wait at each count.
