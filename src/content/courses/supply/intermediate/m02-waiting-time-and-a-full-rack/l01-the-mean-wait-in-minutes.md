# The mean wait in minutes

A probability of waiting tells a driver how likely a queue is. It does not say how long the queue will hold them. The engine's next figure does: the mean wait, printed in minutes. This lesson reads it, and reads carefully what kind of average it is.

{{panel:supply-depot-explorer}}

## The formula the engine uses

For an M/M/c rack the engine computes:

mean wait = Erlang C / (bays x service rate - arrivals)

The service rate is the loads a single bay manages an hour, 60 divided by the load minutes. The denominator is the rack's spare loading capacity an hour: what all the bays together could load, less what is arriving. The engine prints the result in minutes, to four decimals.

For IBAFO at 9 arrivals an hour, 24 minute loads and 4 bays:

| item | value |
| --- | --- |
| probability of waiting (Erlang C) | 0.787753 |
| mean wait, minutes | 47.2652 |
| mean time on site, minutes | 71.2652 |

## An average over every truck

The formula carries the probability of waiting as a factor. That tells you what the average covers: every truck that arrives, including the trucks that find a free bay and wait no time at all. Those trucks count in the mean as zero. A truck that does wait therefore waits longer, on average, than the mean wait suggests. The engine prints no figure for the wait of a truck that queues, so this course quotes none, and you should not work one out beside the engine's figure and present it as the engine's.

Two practical consequences follow. First, a driver's complaint and the rack's mean wait can both be honest. The driver remembers the queues; the mean includes the trucks that drove straight onto a bay. Second, a mean wait is only comparable with another mean wait of the same kind. A figure from another depot that averages only over waiting trucks is a different quantity.

## The spare capacity drives it

The denominator explains why the wait climbs so steeply as a rack fills. When arrivals come close to what the bays can load, the spare capacity shrinks towards nothing and the mean wait grows without bound. The bay sweep at 9 arrivals an hour shows it from the other side, as spare capacity is added:

| bays | probability of waiting | mean wait minutes |
| --- | --- | --- |
| 3 | 1.000000 | none |
| 4 | 0.787753 | 47.2652 |
| 5 | 0.410394 | 7.0353 |
| 6 | 0.196566 | 1.9657 |
| 7 | 0.086243 | 0.6088 |

At 3 bays there is no spare capacity at all, and the engine prints none for the wait. The lesson after next explains that refusal.

## Time on site

The mean time on site is the whole visit: the wait in the yard and the time on the bay. For a haulier this is the figure that matters, because a truck on site is a truck earning nothing. The truck lane in module five carries queueing hours in its cycle for exactly this reason, as a typed input of its own.

## Units

The engine works in hours internally, because the arrivals and the service rate are per hour, and it prints minutes. Keep the unit in every quote. A mean wait of 47.2652 read as hours would describe a different depot.

## Exercise

Read IBAFO's probability of waiting, mean wait and mean time on site at 4 bays. Say what population of trucks the mean wait is averaged over, and why a driver who queued that morning might report a longer wait than the mean. Then read the bay sweep and say what the row at 3 bays prints for the wait, and what that says about the rack's spare capacity.
