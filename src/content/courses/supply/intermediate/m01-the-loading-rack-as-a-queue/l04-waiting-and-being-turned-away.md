# Waiting and being turned away

Two queueing formulas carry the name Erlang, and they answer different questions about a truck that finds every bay busy. Erlang C assumes the truck waits. Erlang B assumes it is turned away. The engine uses both, and a practitioner has to know which one the printed figure is.

{{panel:supply-depot-explorer}}

## Two ways a full rack can behave

Picture the moment every bay at a rack is occupied and another truck arrives. One of two things happens.

In the first, the truck joins a line in the yard and loads when a bay frees. Nobody is lost; the cost is time. The probability that an arriving truck meets this situation is Erlang C, and it is the figure `rackQueue` reports as the probability of waiting.

In the second, there is no line. The truck is refused at the gate and leaves, perhaps for another depot. Nobody waits; the cost is a lost lifting. The probability of that is Erlang B, the blocking probability of a system with no waiting room.

The two figures are related, and the engine exploits that. It computes Erlang B first, by a recursion over the bays, and then converts it to Erlang C. The Erlang B figure is an intermediate step on the way. This course prints no Erlang B value, and quotes none.

## Which model fits a depot

A loading rack with a truck park behaves like the first case. Tankers queue and are loaded in turn, so the M/M/c queue with waiting is the right model, and Erlang C is the right probability. The model assumes the yard has room for every truck that arrives and that no driver gives up.

Real depots break that assumption at the edges. A yard has a fence, and a driver who sees a long line may leave. A depot that turns trucks away when the yard is full is partly a loss system, and its drivers experience something between the two models. The engine models only the waiting case. If your depot turns trucks away, say so beside the figure, because the printed probability of waiting then describes a rack with a larger yard than yours.

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

Read the IBAFO probability of waiting, mean wait and mean time on site. Say which Erlang figure the probability is, what the model assumes about a truck that finds every bay busy, and what the difference between the mean time on site and the mean wait represents. Then describe a depot for which the printed probability would mislead, and say why.
