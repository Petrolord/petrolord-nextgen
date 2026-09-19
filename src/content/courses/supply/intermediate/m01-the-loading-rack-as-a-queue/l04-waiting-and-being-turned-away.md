# Waiting and being turned away

Two queueing formulas carry the name Erlang, and they answer different questions about a truck that finds every bay busy. Erlang C assumes the truck waits. Erlang B assumes it is turned away. The engine uses both, and a practitioner has to know which one the printed figure is.

{{panel:supply-depot-explorer}}

## Two ways a full rack can behave

Every bay is occupied and another truck arrives. One of two things happens.

In the first, the truck joins a line in the yard and loads when a bay frees. Nobody is lost; the cost is time. The probability that an arriving truck meets this situation is Erlang C, and it is the figure `rackQueue` reports as the probability of waiting.

In the second, there is no line. The truck is refused at the gate and leaves. Nobody waits; the cost is a lost lifting. The probability of that is Erlang B, the blocking probability of a system with no waiting room.

The two figures are related. The engine builds Erlang C from the Erlang B recursion over the bays, and it exports only Erlang C. The digest derives Erlang B back from the engine's Erlang C by the identity B = C x (1 - utilisation) / (1 - utilisation x C). Derived that way, the IBAFO rack's Erlang B is 0.270685, against its Erlang C of 0.787753. Every Erlang B in this lesson is that derivation and is quoted as derived.

The load minutes swept at 9 arrivals an hour on 4 bays carry both:

| load minutes (stated) | utilisation | probability of waiting | Erlang B, derived from the Erlang C |
| --- | --- | --- | --- |
| 16 | 0.600000 | 0.287043 | 0.138706 |
| 20 | 0.750000 | 0.509434 | 0.206107 |
| 24 | 0.900000 | 0.787753 | 0.270685 |
| 26 | 0.975000 | 0.945114 | 0.300939 |

## Which model fits a depot

A loading rack with a truck park behaves like the first case. Tankers queue and load in turn, so Erlang C is the right probability.

Real depots break that at the edges: a yard has a fence, and a driver who sees a long line may leave. A depot that turns trucks away when the yard is full is partly a loss system, and its drivers experience something between the two models. The engine models only the waiting case. If your depot turns trucks away, say so beside the figure, because the printed probability of waiting then describes a rack with a larger yard than yours.

## What waiting costs in minutes

For IBAFO at 9 arrivals an hour, 24 minute loads and 4 bays, the engine reports:

| item | value |
| --- | --- |
| probability of waiting (Erlang C) | 0.787753 |
| mean wait, minutes | 47.2652 |
| mean time on site, minutes | 71.2652 |

The mean wait is time in the yard before a bay. The mean time on site adds the time on the bay itself. Neither figure contains a lost truck, because the model has none.

## Why the distinction matters for decisions

Fewer lost liftings and shorter waits are different goals. The first needs the chance that a truck cannot be served at all. The second needs the chance that it queues, and how long for. Answering the first with an Erlang C figure overstates the lost trade, because a truck that waits still loads. Answering the second with an Erlang B figure understates the problem, because it ignores the line. Name the model before you name the figure.

## Exercise

Read the IBAFO probability of waiting, the derived Erlang B of 0.270685, the mean wait and the mean time on site. Say which Erlang figure the printed probability is, what the model assumes about a truck that finds every bay busy, and what the difference between the mean time on site and the mean wait represents. Then describe a depot for which the printed probability would mislead, and say why.
