# Parallel adds flow at equal head

Two identical pumps side by side do not deliver twice the flow. The reason is not in the pumps, and the engine makes it visible by re-solving the duty rather than doubling anything.

{{panel:fc-suction-explorer}}

## What parallel means to a curve

Machines in parallel share a suction and a discharge, so they all work against the same head. The combined curve is therefore built by adding flows at equal head: pick a head, ask each machine what flow it makes there, and add.

That gives a new machine curve. The duty is then solved the way any duty is solved, as the crossing of that curve with the system, and the system is the one that was already there.

## Identical machines on a friction-dominated system

The system is a static head of 60.000000 ft plus a friction head of 380.000000 ft at 1100.000000 gpm.

| machines | duty flow gpm | duty head ft | flow over one machine | flow per machine gpm |
| --- | --- | --- | --- | --- |
| 1 | 1103.518695 | 442.434987 | 1.000000000 | 1103.518695 |
| 2 | 1198.970966 | 511.456135 | 1.086498100 | 599.485483 |
| 3 | 1219.484579 | 527.036531 | 1.105087375 | 406.494860 |
| 4 | 1226.902650 | 532.735738 | 1.111809573 | 306.725662 |

Two machines do not give two. The flow over one machine on that row is 1.086498100.

## Why, and the column that says so

Each machine is running further left on its own curve, and the system is demanding more head for the extra flow. That is the whole mechanism, and the flow per machine column is where it shows: one machine carries 1103.518695 gpm on its own, and with a second machine on the manifold each carries 599.485483 gpm.

The head column is the other half of the same story. One machine works against 442.434987 ft. Four machines work against 532.735738 ft, because the system charges more head for the flow they are pushing through it.

## This is a property of the system

Nothing here is a criticism of the pumps. A system whose head is mostly friction rises steeply with flow, so extra flow is expensive in head, and the machines meet it sooner. A system whose head is mostly static behaves differently, and the way to find out is to state the system and re-solve rather than to carry a rule of thumb.

## The mistake

The mistake is sizing a manifold by multiplication. Two machines quoted at 1103.518695 gpm each gives a number that no row of this table contains, and the duty the station will actually run is 1198.970966 gpm.

The second mistake is quoting a per-machine flow as a station flow, or the reverse. On the two-machine row those are 599.485483 gpm and 1198.970966 gpm, and both are correct answers to different questions.

The third is assuming a fourth machine is worth what the first was. The station flow on the four-machine row is 1226.902650 gpm and each machine is down to 306.725662 gpm, and everything about whether that is worth buying sits outside this calculation.

## Exercise

Give the station flow, the station head and the flow per machine for one, two and four machines on this system. Then explain in one sentence why the second machine does not double the flow, and say which two figures on the two-machine row must never be swapped.
