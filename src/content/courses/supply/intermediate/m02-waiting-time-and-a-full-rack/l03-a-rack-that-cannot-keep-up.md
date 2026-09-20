# A rack that cannot keep up

Every figure so far has come from a rack that can, on average, load trucks faster than they arrive. This lesson takes IBAFO's rack past that point and reads what the engine prints when the arithmetic has no answer. It is the engine fact this tier is built around.

{{panel:supply-depot-explorer}}

## The arrivals sweep

The rack keeps its 4 bays and 24 minute loads while the arrivals rise:

| arrivals per hour | utilisation | the engine answers |
| --- | --- | --- |
| 6 | 0.600000 | probability of waiting 0.287043, mean wait 4.3056 minutes |
| 7 | 0.700000 | probability of waiting 0.428654, mean wait 8.5731 minutes |
| 8 | 0.800000 | probability of waiting 0.596432, mean wait 17.8930 minutes |
| 9 | 0.900000 | probability of waiting 0.787753, mean wait 47.2652 minutes |
| 9.5 | 0.950000 | probability of waiting 0.891419, mean wait 106.9703 minutes |
| 10 | 1.000000 | stable false, probability of waiting 1.000000, mean wait none |

Quote the waits in order from the top: 4.3056 minutes, then 8.5731, then 17.8930, then 47.2652, then 106.9703. Set them beside the utilisation column: 0.600000, 0.700000, 0.800000, 0.900000 and 0.950000. The mean wait formula divides by the bays times the service rate less the arrivals, and down this table only the arrivals change.

## The row where no average exists

At 10 arrivals an hour the utilisation reaches 1.000000. The arriving work equals what the bays can load. The engine does not print a very large wait. It refuses, with its own sentence:

> REFUSED: The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.

The refusal is exact. In its own words the queue grows without limit, so no average waiting time exists. An average of a quantity that grows without limit does not exist, and a figure printed for it would be an artefact of the arithmetic. A rack at a utilisation of exactly one is already in this state. The boundary is at one, and one is on the wrong side of it.

The engine still reports what it can: stable false, and a probability of waiting of 1.000000. Every arriving truck waits.

## The same verdict from the bay side

The bay sweep reaches the same place with the arrivals held at 9 an hour. At 3 bays the utilisation is 1.200000, the rack is marked unstable, the probability of waiting is 1.000000 and both the mean wait and the mean queue print none.

## Reading the three remedies

The refusal names three ways out, and each moves a different input. Adding a bay raises the denominator of the utilisation. Loading faster shortens the load minutes and so lowers the offered load. Spreading the arrivals lowers the arrivals in the peak hour. The digest sweeps all three inputs. On 4 bays at 9 arrivals an hour, the load minutes sweep prints a mean wait of 47.2652 minutes at 24 minutes a load and 10.1887 minutes at 20.

## Why a refusal is the better answer

A model that printed a large wait at a utilisation of one would invite a planner to call the rack slow. The rack is not slow. It is overrun, and no amount of patience in the yard fixes it. The refusal sends the reader to the inputs, which is where the problem lives.

## Exercise

Read the arrivals sweep from 6 to 9.5 arrivals an hour and quote each mean wait. Quote the utilisation beside each. Then read the row at 10 arrivals and quote the engine's refusal. Say why the engine prints no mean wait there, and which input each of its three remedies changes.
