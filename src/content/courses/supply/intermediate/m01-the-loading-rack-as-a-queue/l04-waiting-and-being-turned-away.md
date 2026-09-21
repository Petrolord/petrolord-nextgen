# Waiting and being turned away

Two queueing formulas carry the name Erlang, and they answer different questions about a truck that finds every bay busy. Erlang C assumes the truck waits. Erlang B assumes it is turned away. The engine uses both, and a practitioner has to know which one the printed figure is.

{{panel:supply-depot-explorer}}

## Two ways a full rack can behave

Every bay is occupied and another truck arrives. One of two things happens.

In the first, the truck joins a line in the yard and loads when a bay frees. Nobody is lost; the cost is time. The probability that an arriving truck meets this situation is Erlang C, and it is the figure `rackQueue` reports as the probability of waiting.

In the second, there is no line. The truck is refused at the gate and leaves. Nobody waits: in the course's words, a truck that finds every bay busy leaves. The probability of that is Erlang B, the blocking probability of a system with no waiting room.

The two figures are related. The engine builds Erlang C from the Erlang B recursion over the bays, and it exports only Erlang C. The course derives Erlang B back from the engine's Erlang C by the identity B = C x (1 - utilisation) / (1 - utilisation x C). Derived that way, the IBAFO rack's Erlang B is 0.270685, against its Erlang C of 0.787753. Every Erlang B in this lesson is that derivation and is quoted as derived.

The load minutes swept at 9 arrivals an hour on 4 bays carry both:

| load minutes (stated) | utilisation | probability of waiting | Erlang B, derived from the Erlang C |
| --- | --- | --- | --- |
| 16 | 0.600000 | 0.287043 | 0.138706 |
| 20 | 0.750000 | 0.509434 | 0.206107 |
| 24 | 0.900000 | 0.787753 | 0.270685 |
| 26 | 0.975000 | 0.945114 | 0.300939 |

## Which model fits a depot

The engine models the first case. rackQueue is an M/M/c queue in which a truck that finds every bay busy waits, so the probability it prints is Erlang C.

The engine models only the waiting case. If your depot turns trucks away, say so beside the figure, because the printed probability of waiting comes from a model in which no truck leaves.

## What waiting costs in minutes

For IBAFO at 9 arrivals an hour, 24 minute loads and 4 bays, the engine reports:

| item | value |
| --- | --- |
| probability of waiting (Erlang C) | 0.787753 |
| mean wait, minutes | 47.2652 |
| mean time on site, minutes | 71.2652 |

The course says of the mean wait that it averages over every truck, the ones that load at once included. It prints the mean time on site beside it with no formula of its own, so quote that figure by its label. Neither figure contains a lost truck, because the model has none.

## Why the distinction matters for decisions

Fewer trucks leaving and shorter waits are different questions. The first needs the chance that a truck finds every bay busy in a rack with no queue, the Erlang B figure, 0.270685 at IBAFO. The second needs the chance that a truck queues, the Erlang C figure, 0.787753, and how long for. Answering either question with the other model's figure answers the other question. Name the model before you name the figure.

## Exercise

Read the IBAFO probability of waiting, the derived Erlang B of 0.270685, the mean wait and the mean time on site. Say which Erlang figure the printed probability is, and what the model assumes about a truck that finds every bay busy. Then describe a depot for which the printed probability would mislead, and say why.
