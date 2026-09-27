# A signal and its likelihoods

{{panel:farmout-valuation-calculator}}

A real survey does not reveal the outcome. It returns a signal, and each signal is more or less likely depending on whether the well will succeed. Those likelihoods are the whole description of the survey, and the engine takes them as stated inputs with no default.

## The Ekene survey

The Ekene fixture (synthetic) states a seismic survey costing 1500000.000000 with two signals:

| signal | chance given success (stated) | chance given a dry hole (stated) |
| --- | --- | --- |
| bright amplitude | 75.000000 | 25.000000 |
| dim amplitude | 25.000000 | 75.000000 |

Read the columns, one outcome at a time. If the well will succeed, the survey shows bright 75.000000 percent of the time and dim 25.000000 percent. If it will be a dry hole, the proportions are reversed. Each column sums to 100 over the signals, because some signal is always returned.

## From likelihoods to what the signal tells you

The engine applies Bayes through the canonical evii of decisionTree.js, so the chance of each signal and the chance of success after it are consistent by construction. The chance of a bright signal is the chance of success, 25.000000 percent, times 75.000000 percent, plus the chance of a dry hole times 25.000000 percent. The engine returns 0.375000 for bright and 0.625000 for dim. The chance of success after a bright signal is the success share of that bright chance: 50.000000 percent. After a dim signal it is 10.000000 percent (engine).

| golden case | signal | chance of the signal | chance of success after it |
| --- | --- | --- | --- |
| info-ekene-farminee | bright amplitude | 0.375000 | 50.000000 |
| info-ekene-farminee | dim amplitude | 0.625000 | 10.000000 |

A signal chance prints as a probability and a chance of success as a percentage.

## What the engine refuses

A signal set that cannot be a survey is refused by name, before anything is computed. One signal tells nothing:

> information.signals must be an array of at least 2 signals; got [{"label":"a","likelihoodsPct":[100,100]}]

Likelihoods given success that do not sum to 100 over the signals describe no survey:

> information.signals must have likelihoodsPct[0] summing to 100 over the signals (P(signal / success)); got a sum of 95

Each signal states two likelihoods, one given success and one given a dry hole, in per cent:

> information.signals[0].likelihoodsPct must be an array [P(signal / success), P(signal / dry hole)] in per cent; got [75]

The engine accepts at most 10 signals in one call. The engine checks the shape and the sums of the likelihoods and derives everything else from them.

## Why the likelihoods matter more than the label

The words "bright" and "dim" carry no weight in the arithmetic. A signal equally likely under success and under a dry hole leaves the chance of success where it was, whatever it is called, and a later lesson shows that such a signal is worth nothing. The spread between a signal's two likelihoods is what moves the chance of success.

## Exercise

Open the valuation calculator on the view "The value of information to one side" and start from "The Ekene survey to the farminee". Read the per-signal table: the chance of each signal and the chance of success after it. Now set the control "signal 1: chance given success, percent (stated)" to a different figure and leave signal 2 alone; read the refusal and name the column whose sum it reports. Set signal 2's chance given success so the column sums to 100 again and read how the chance of success after each signal moves. Then move both dry-hole likelihoods closer together and describe, in words, what happens to the gap between the two posteriors.
