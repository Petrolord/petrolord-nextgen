# Positions wholly working

KANO's carousel has 18 positions, each available 0.92 of the time. The queue does not run on 18, and it does not run on 16.5600. It runs on 16. This lesson reads how `bottlingPlant` gets from the positions installed to the positions wholly working, and which figure each result uses.

{{panel:gasvalue-rollout-explorer}}

## From installed to working

The engine's rule: the carousel is the loading-rack queue run on the positions wholly working, the floor of the positions times the availability.

| field | value |
| --- | --- |
| effectivePositions | 16.5600 |
| queuePositions | 16 |
| throughputCapacityPerDay | 4516.3600 |
| minimumPositionsForThroughput | 13 |
| meetsDemand | true |

effectivePositions is 16.5600: the positions times the availability. queuePositions is 16: the floor of that figure. The count prints as a whole number, 16, with no decimals.

## The engine says so on the result

The result carries positionRoundingNote, and it states the step in full: "The queue is computed on 16 working positions, rounded down from 16.56, because a queue has a whole number of servers. The throughput capacity below uses the unrounded figure."

The note fixes two things. The queue's figures (utilisation 0.7333, probability of waiting 0.1769, average wait 0.0912 minutes, queue length 0.4866) are computed on 16 working positions. The throughput capacity, 4516.3600 a day, uses the unrounded figure. Two results on one carousel therefore sit on two different position figures, and the note names which is which.

## Rounded down

The rule is the floor. 16.5600 is rounded down to 16. Positions rounded to the nearest whole one give a figure that looks finished, and the engine does not take that step. The table of whole position counts from the last lesson prints what other counts do to the wait:

| positions (input) | probabilityOfWaiting | averageWaitMinutes |
| --- | --- | --- |
| 16 | 0.1769 | 0.0912 |
| 17 | 0.1078 | 0.0450 |
| 18 | 0.0633 | 0.0222 |

KANO's queue is the 16 row, with the same probability of waiting and the same wait. The 17 and 18 rows are the same carousel on other whole counts, run at availability 1.

## The studio's carousel

The studio's opening carousel runs the same rule: 16 positions at 0.9 give effectivePositions 14.4000 and queuePositions 14, with an average wait of 0.9850 minutes.

## Fewer than one

A carousel with too little availability is refused:

| probe | engine |
| --- | --- |
| one position at availability 0.4 | REFUSED: Only 0.4 positions are working on average: fewer than one. |
| shift hours left blank ('') | REFUSED: Shift hours must be positive and availability must lie in (0, 1]. |
| availability 1.2 | REFUSED: Shift hours must be positive and availability must lie in (0, 1]. |
| no fill time | REFUSED: Demand, fill time and a position count are required and must be positive. |

One position at 0.4 is refused with the working count stated. Shift hours left blank and an availability of 1.2 are refused with one shared sentence. Availability must lie in (0, 1], so 1 is allowed and 1.2 is refused.

## The minimum

minimumPositionsForThroughput prints 13 for KANO. It is a count, printed whole, and it sits beside queuePositions 16. The engine prints both counts; this lesson reads them as two figures and leaves them there.

In practice, a plant's maintenance log is where an availability figure for its positions comes from.

## In the explorer

Open KANO's carousel and read effectivePositions, queuePositions, the rounding note and the throughput capacity. Set the availability to 0.9 and read both figures again. Then try one position at 0.4 and read the refusal.

## Exercise

Read KANO's effectivePositions 16.5600 and queuePositions 16, the rounding note, and throughputCapacityPerDay 4516.3600. Say how the engine gets from 18 positions at 0.92 to 16, which result is computed on 16 and which on the unrounded figure, and what the engine answers for one position at availability 0.4.
