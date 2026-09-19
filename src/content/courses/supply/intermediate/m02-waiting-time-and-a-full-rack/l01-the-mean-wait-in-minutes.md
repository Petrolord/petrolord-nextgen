# The mean wait in minutes

A probability of waiting says how likely a queue is. The mean wait, printed in minutes, says how long. This lesson reads it, and reads what kind of average it is.

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

The formula carries the probability of waiting as a factor. That tells you what the average covers: every truck that arrives, including the trucks that find a free bay and wait no time at all. Those trucks count in the mean as zero. The digest prints the mean wait of a truck that does queue as the mean wait over the probability of waiting: 47.2652 / 0.787753 = 60.0000 minutes. The engine's 47.2652 minutes averages over every truck; the 60.0000 minutes averages over the trucks that queue.

So a driver's complaint and the rack's mean wait can both be honest: the driver remembers the queues, and the mean includes the trucks that drove straight onto a bay. A mean wait is only comparable with another of the same kind.

The load minutes swept on the same 4 bays at 9 arrivals an hour:

| load minutes (stated) | probability of waiting | mean wait minutes |
| --- | --- | --- |
| 16 | 0.287043 | 2.8704 |
| 20 | 0.509434 | 10.1887 |
| 22 | 0.642160 | 20.1822 |
| 24 | 0.787753 | 47.2652 |
| 26 | 0.945114 | 245.7297 |

The load time is part of the spare capacity too. Only the load minutes change down this table, and the printed mean wait goes from 2.8704 minutes at 16 minutes a load to 245.7297 minutes at 26.

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

The mean time on site is the whole visit: the wait in the yard and the time on the bay. For a haulier this is the figure that matters. The truck lane in module five carries queueing hours in its cycle for exactly this reason, as a typed input of its own.

## Units

The engine works in hours internally, because the arrivals and the service rate are per hour, and it prints minutes. Keep the unit in every quote. A mean wait of 47.2652 read as hours would describe a different depot.

## Exercise

Read IBAFO's probability of waiting, mean wait and mean time on site at 4 bays. Say what population of trucks the mean wait is averaged over, and use the printed 60.0000 minutes to say why a driver who queued that morning might report a longer wait than the mean. Then read the bay sweep and say what the row at 3 bays prints for the wait, and what that says about the rack's spare capacity.
