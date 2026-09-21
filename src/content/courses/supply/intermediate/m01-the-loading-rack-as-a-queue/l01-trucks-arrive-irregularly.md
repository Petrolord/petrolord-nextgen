# Trucks arrive irregularly

A depot's loading rack is judged by what happens to a truck at the gate. If trucks came on a timetable and every load took exactly the same minutes, the rack would need no theory: compare the loads an hour with what the bays can manage and stop. Trucks do not arrive that way. Drivers meet different traffic, and loads differ. This tier treats both as random, and that one choice shapes every answer in the first two modules.

{{panel:supply-depot-explorer}}

## The model the engine uses

The engine's `rackQueue` models the rack as an M/M/c queue. The first M says trucks arrive at random around a stated mean rate. The second M says each truck holds its bay for a random time around a stated mean. The c is the number of bays. Nothing else is assumed: no appointment system, no priority lane, no truck that gives up and drives away.

IBAFO is an inland depot invented for this course. Its rack is described by three inputs:

| input | IBAFO |
| --- | --- |
| arrivals per hour | 9 |
| mean load minutes | 24 |
| bays | 4 |

At that arrival rate the engine counts 216 trucks a day. The day count is a mean rate multiplied out. It says nothing about how those trucks are spaced. The model takes them as arriving at random about the mean rate, and every queue figure the engine prints comes from that random pattern.

## Why randomness is the honest assumption

Random arrivals are the model's stated assumption, and every figure quoted from it carries that assumption. If your depot's arrivals follow some other pattern, say so beside any figure you quote. The model is stated, so a reader can check it.

The load time is random for the same reason. A mean of 24 minutes describes a typical load, and the model lets individual loads run shorter and longer around it.

## What the engine needs, and what it refuses

The arrival rate and the load time are both measured inputs. Leave either one blank, or type a load time of 0 minutes, and the call stops with the engine's own sentence:

> REFUSED: Arrival rate and load time are both needed.

The engine does not borrow a typical depot's traffic. A queue computed from a guessed arrival rate would still print a wait to four decimals, and that wait would describe no rack at all. The bay count is required as well, and the last lesson of this module shows what the engine does with a bay count that is missing or is not a whole number.

## What this module builds

The next four lessons walk the chain the engine computes from these inputs: the offered load in erlangs, the utilisation, the probability that an arriving truck waits, and the rule that bays come whole. Module two turns those into minutes of waiting and trucks in the queue, and shows the arrival rate at which no average wait exists.

## Exercise

Read the IBAFO rack inputs and the engine's count of 216 trucks a day. Say what the day count tells a depot manager and what it cannot tell them about any single hour. Then name the inputs the engine refuses to run without, quote its sentence, and say why a guessed value would be worse than the refusal.
