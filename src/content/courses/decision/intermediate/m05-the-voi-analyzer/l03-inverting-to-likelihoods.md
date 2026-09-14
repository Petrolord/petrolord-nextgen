# Inverting to likelihoods

Typed posteriors describe a survey mixed with a prior. Bayes run backwards separates the two: P(indicator | outcome) = P(outcome | indicator) x P(indicator) / P(outcome), and what comes out is the survey on its own.

{{panel:ec-information-explorer}}

## Four likelihoods by hand

The EKPAN lottery typed into the Analyzer reads Bright spot 46.000000 percent, P(Success | Bright spot) 64.673913 percent and P(Success | No bright spot) 9.722222 percent, against stated chances of 0.350000 for success and 0.650000 for a dry hole. Each dry-hole posterior is what its row leaves, 0.353261 after a bright spot and 0.902778 after none, and no bright spot arrives with 0.540000.

| likelihood | arithmetic | result |
| --- | --- | --- |
| Bright spot given Success | 0.646739 x 0.460000 / 0.350000 | 0.850000 |
| Bright spot given Dry hole | 0.353261 x 0.460000 / 0.650000 | 0.250000 |
| No bright spot given Success | 0.097222 x 0.540000 / 0.350000 | 0.150000 |
| No bright spot given Dry hole | 0.902778 x 0.540000 / 0.650000 | 0.750000 |

The results are the survey's own likelihoods, 0.850000 and 0.250000 for a bright spot, the numbers the posteriors came from in the first place.

## The check the inversion carries

Each outcome's column sums to 1: 0.850000 + 0.150000 over a success, 0.250000 + 0.750000 over a dry hole. That is no accident. The Success column adds up the weighted posteriors and divides by the stated success chance, so it sums to the implied success chance over the stated one, and it sums to 1 exactly when the typing is consistent.

Break the typing and the inversion shows it. With Bright spot typed at 56 percent and the posteriors unchanged, Bright spot given Success becomes 0.646739 x 56 percent / 0.350000, which is greater than 1. No survey shows a bright spot more often than always. The repaired Analyzer withholds the value on those inputs, and the inversion says why on paper.

## Why likelihoods are the survey

A likelihood belongs to the tool: how often a bright spot shows over a success and over a dry hole. A posterior belongs to the tool on one prospect, because the prior is inside it. The posterior 0.646739 came from a prior of 0.350000; move the prior and the likelihoods stay put while every posterior must be worked again. Posteriors carried to another prospect, or kept after the prior is revised, contradict the new stated chances, and the Analyzer withholds the value.

The tree engine takes likelihoods and derives the posteriors itself, so its inputs cannot contradict each other. Inverting is the way from one tool to the other, and on the EKPAN lottery the tree engine then values the survey at 24.8250 with the farm-out still in play.

## The mistake

The careful mistake is reading a posterior as the survey's hit rate. The survey shows a bright spot over 0.850000 of successes; 64.673913 percent is the chance of success once a bright spot is seen, lower because dry holes are common and 0.250000 of them show one too. Taken the other way, 0.850000 read as the posterior values Drill after a bright spot at 298.2500 against 207.7989. The second mistake is dividing by the indicator chance, which belongs on top of the fraction.

## What it refuses

The Analyzer never inverts and never shows likelihoods. The inversion is a hand calculation.

## Exercise

Invert the No bright spot row to its two likelihoods and show that each outcome's column sums to 1. Then explain why Bright spot typed at 56 percent with the same posteriors inverts to a likelihood greater than 1, and what the repaired Analyzer does with those inputs.
