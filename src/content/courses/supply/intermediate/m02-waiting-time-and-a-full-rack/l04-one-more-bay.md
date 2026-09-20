# One more bay

A depot with a queue asks one question sooner or later: what would another bay buy? The engine cannot answer the whole question, because the answer depends on what a bay costs and what a waiting truck costs, and neither is in this course. It can answer the service half precisely. This lesson reads that half and marks where it stops.

{{panel:supply-depot-explorer}}

## The sweep as a menu

At IBAFO's 9 arrivals an hour and 24 minute loads, the engine prints each whole rack from 3 bays to 7:

| bays | utilisation | stable | probability of waiting | mean wait minutes | mean queue trucks |
| --- | --- | --- | --- | --- | --- |
| 3 | 1.200000 | false | 1.000000 | none | none |
| 4 | 0.900000 | true | 0.787753 | 47.2652 | 7.0898 |
| 5 | 0.720000 | true | 0.410394 | 7.0353 | 1.0553 |
| 6 | 0.600000 | true | 0.196566 | 1.9657 | 0.2948 |
| 7 | 0.514286 | true | 0.086243 | 0.6088 | 0.0913 |

Each row is a different rack facing the same traffic. The offered load is 3.6000 erlangs in every row.

## Reading the steps

From 3 bays to 4 the rack moves from unstable to stable. The engine prints no wait at 3 bays and 47.2652 minutes at 4. That first step is the difference between a queue that never clears and one that does.

From 4 bays to 5 the probability of waiting moves from 0.787753 to 0.410394, the mean wait from 47.2652 minutes to 7.0353, and the mean queue from 7.0898 trucks to 1.0553.

From 5 to 6 the mean wait moves from 7.0353 minutes to 1.9657, and from 6 to 7 from 1.9657 to 0.6088.

Quote the pairs as they are. A statement of how many times shorter one wait is than another is a ratio this course does not print, and it should not appear in a report as if the engine had computed it.

## Where the engine stops

The engine prices nothing here. The rack model has no cost for a bay, no cost for a truck's hour in the yard, and no value for a lifting a driver takes elsewhere. The throughput economics in module four carries a fee and costs for the depot's period, and none of them is a bay's cost. A decision to build a bay joins this sweep to costs from outside the engine, and a report should say where each cost came from.

What the sweep does give is the service consequence of each whole choice, stated in the units a manager can check: a probability, minutes and trucks. A proposal that says "a fifth bay cuts the wait to 7.0353 minutes and the average line to 1.0553 trucks at today's traffic" is precise and checkable. A proposal that says a fifth bay "solves the queue" is neither.

## Traffic moves too

The sweep holds the arrivals at 9 an hour. A depot's traffic grows. The arrivals sweep at 4 bays showed the wait reaching 106.9703 minutes at 9.5 arrivals an hour and the engine refusing at 10. A bay chosen for today's traffic should be read against the arrivals it will face, by rerunning the queue at the forecast rate.

Load time is the third lever. On the same 4 bays at 9 arrivals an hour, the load minutes swept print a mean wait of 10.1887 minutes at 20 minutes a load, 47.2652 at 24 and 245.7297 at 26. Quote the row that matches the load time a proposal promises.

## Exercise

Read the bay sweep at 4, 5 and 6 bays. Quote the probability of waiting, the mean wait and the mean queue in each row with their units. Say which figures the step from 4 to 5 bays moves, what the offered load does across the sweep, and what else a decision to build the fifth bay needs that the engine does not supply.
