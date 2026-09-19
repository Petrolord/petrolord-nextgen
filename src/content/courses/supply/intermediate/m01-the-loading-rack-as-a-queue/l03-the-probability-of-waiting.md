# The probability of waiting

The utilisation says how busy the bays are on average. It does not say how often a truck arrives to find them all busy. That second figure is the one a driver feels, and the engine computes it separately, as the Erlang C probability of waiting.

{{panel:supply-depot-explorer}}

## What Erlang C answers

Erlang C is the probability that a truck arriving at an M/M/c rack finds every bay occupied and has to wait. It depends on the offered load and the bay count together. The engine builds it from the Erlang B recursion, a step-by-step calculation over the bays that stays well behaved at any bay count, and then turns the Erlang B figure into Erlang C. The next lesson separates the two.

At IBAFO, with 9 arrivals an hour, 24 minute loads and 4 bays, the engine prints:

| item | value |
| --- | --- |
| offered load, erlangs | 3.6000 |
| utilisation | 0.900000 |
| probability of waiting (Erlang C) | 0.787753 |

Those are three different figures and each has its own meaning. The utilisation, 0.900000, is the share of bay time spent loading. The probability of waiting, 0.787753, is the chance that a particular arriving truck queues. A manager who reads the first and assumes the second has confused the rack's view with the driver's.

## Why the two differ

The utilisation is an average over the bays. A moment with three of the 4 bays loading counts towards it, and so does a moment with one bay loading. A truck waits only in a moment when every bay is busy at once. The probability of waiting is therefore a statement about how often the whole rack is full, and with trucks arriving at random, an arriving truck meets the rack as it stands at a random moment. An average over bays and the share of time with all of them full are different measures, so neither can be read off the other. The engine computes each from the same three inputs and prints both, and a quote should name which one it carries.

## The same utilisation, a different probability

The engine's two sweeps contain a pair of rows that makes this plain. Both have a utilisation of 0.600000.

| case | bays | utilisation | probability of waiting |
| --- | --- | --- | --- |
| 6 arrivals an hour | 4 | 0.600000 | 0.287043 |
| 9 arrivals an hour | 6 | 0.600000 | 0.196566 |

The utilisations match and the probabilities do not. A larger rack running at the same utilisation pools more bays against the same bunching, so an arriving truck is more likely to find one free. Any rule of thumb stated as a utilisation limit, with no bay count beside it, is silent on this.

## Reading the sweeps

The bay sweep at 9 arrivals an hour:

| bays | utilisation | probability of waiting |
| --- | --- | --- |
| 3 | 1.200000 | 1.000000 |
| 4 | 0.900000 | 0.787753 |
| 5 | 0.720000 | 0.410394 |
| 6 | 0.600000 | 0.196566 |
| 7 | 0.514286 | 0.086243 |

The arrivals sweep at 4 bays:

| arrivals per hour | utilisation | probability of waiting |
| --- | --- | --- |
| 6 | 0.600000 | 0.287043 |
| 7 | 0.700000 | 0.428654 |
| 8 | 0.800000 | 0.596432 |
| 9 | 0.900000 | 0.787753 |
| 9.5 | 0.950000 | 0.891419 |

The row at 3 bays prints a probability of 1.000000. On a rack whose utilisation is above one, every arriving truck waits, because the bays never catch up. That row is also marked unstable, and module two explains why the engine prints no wait for it.

Precision matters here. The engine prints probabilities to six decimals, and a quote should keep all six. Rounding 0.787753 before comparing it with another rack's figure throws away exactly the detail the comparison needs.

## Exercise

Read the IBAFO rack at 4 bays: its utilisation and its probability of waiting. Say in one sentence what each figure measures and whose point of view it takes. Then read the two rows that share a utilisation of 0.600000 and say what their probabilities of waiting show about quoting a utilisation limit without a bay count.
