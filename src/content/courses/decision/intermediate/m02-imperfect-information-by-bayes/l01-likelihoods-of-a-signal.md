# Likelihoods of a signal

A survey is described by its likelihoods: the chance of each reading given each outcome. For the EKPAN CSEM survey a bright spot appears with likelihood 0.850000 when the prospect will succeed and 0.250000 when it will be dry.

{{panel:ec-information-explorer}}

## The likelihood table

| signal | given Success | given Dry hole |
| --- | --- | --- |
| Bright spot | 0.850000 | 0.250000 |
| No bright spot | 0.150000 | 0.750000 |

Each column is a distribution over the readings for one outcome. Given Success the survey either shows a bright spot or does not: 0.850000 and 0.150000, which sum to 1. Given Dry hole the same holds for 0.250000 and 0.750000. The rows answer no single question, so nothing requires them to sum to 1, and on this survey neither row does.

## What the numbers describe

0.850000 is the hit rate: how often a success lights up. 0.250000 is the false alarm rate: how often a dry prospect still lights up. 0.150000 is the miss rate. A useful survey needs a hit rate well clear of its false alarm rate, because the reading carries information only to the extent that it is more likely under one outcome than the other. Where a reading is equally likely under both, seeing it moves nothing. The published uselessSignal case shows that end: after either of its readings the posteriors stay at 0.300000 and 0.700000, the priors of its prospect, and its evii is 0.0000.

## Why the engine takes likelihoods

The engine takes the prior and the likelihoods and derives everything else: the chance of each reading, the posteriors, the action after each reading. It never accepts a posterior typed in. So its inputs cannot contradict each other, because every posterior it uses is computed from the one prior. The VOI Analyzer takes typed posteriors instead, and needs a consistency check for exactly that reason.

## What it refuses

A likelihood column that is not a distribution is refused, with the outcome named:

- a Success column summing to 0.900000: "Likelihoods P(signal | "Success") sum to 0.900000, expected 1"
- a Dry hole column summing to 1.200000: "Likelihoods P(signal | "Dry hole") sum to 1.200000, expected 1"

The engine refuses and does not rescale. A column that misses 1 is never quietly normalised.

## Likelihoods are not posteriors

0.850000 is the chance of a bright spot given Success. The chance of Success given a bright spot is a different quantity, 0.646739, once the prior of 0.350000 and the false alarms among the 0.650000 of dry outcomes are counted. Read the likelihood as the posterior and Drill after a bright spot is valued at 298.2500 instead of 207.7989. The overstatement falls on the very reading that argues for drilling.

## The mistake

A survey is usually sold on its hit rate, and a careful reader writes 0.850000 straight onto the success branch that follows a bright spot. The notation prevents it: write P(signal | outcome) for every likelihood, keep the outcome after the bar, and put nothing on an outcome branch until it has been through Bayes.

## Exercise

Write the EKPAN likelihood table and check that each column sums to 1. Name the hit rate, the false alarm rate and the miss rate. Then state the Drill value after a bright spot when 0.850000 is misread as the posterior, and the value the engine uses.
