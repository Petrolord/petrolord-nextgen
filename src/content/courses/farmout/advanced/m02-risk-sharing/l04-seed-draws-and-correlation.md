# Seed, draws and correlation

{{panel:farmout-valuation-calculator}}

Three terms of a risk call are neither deal terms nor prospect terms: the seed, the number of draws and the correlation between holdings. Each is a stated input with no default, and each moves a figure in its own way.

## The seed and the draws

The Monte Carlo draws through the canonical mulberry32 of lib/stats, from the stated seed. The Ekene call states seed 20271111 and 20000 draws. The same seed and the same draw count return the same chance of a loss and the same low and high cases on any machine, which is what lets a course print them at all. A different seed returns different estimates, and more draws bring them closer to the figure they estimate.

A call with no seed is refused:

> seed must be an integer from 0 to 4294967295 (stated; no default); got nothing

The draw count has two limits. No call takes more than 200000 draws:

> iterations must be an integer from 1 to 200000 (stated; no default); got 200001

And the draws times the holdings, over all positions, may not exceed 500000. On a call with three holdings in all, the engine names the most draws those holdings allow:

> iterations must be at most 166666 for 3 holdings in all (iterations x holdings at most 500000); got 200000

The seed and the draws move only the estimates. The EMV and the standard deviation are closed form and do not depend on either.

## The correlation

The correlation is the correlation of the latent drivers of the holdings, one figure for every pair, stated from 0 to 1:

> correlation must be a number from 0 to 1 (the correlation of the latent drivers; stated, no default); got -0.1

It moves the closed-form standard deviation as well as the estimates. The four prospects at 25 percent each carry the same EMV either way (engine):

| golden case | position | correlation, seed, draws (stated) | EMV | standard deviation | chance of a loss (draws) | high case (P10) |
| --- | --- | --- | --- | --- | --- | --- |
| risk-spread-four | four prospects at 25% | 0.000000, 11, 50000 | 20000000.000000 | 53443895.816080 | 0.341480 | 92230348.163821 |
| risk-correlated | four prospects at 25%, correlated | 0.500000, 11, 20000 | 20000000.000000 | 82158383.625775 | 0.480300 | 140000000.000000 |

With a correlation of 0.500000 the standard deviation rises from 53443895.816080 to 82158383.625775. Correlated prospects tend to succeed and fail together, so spreading one bet over four removes less of the risk.

Read the draw counts before comparing estimates. The two rows state different numbers of draws, 50000 and 20000, so their chances of a loss carry different sampling error. The standard deviations are closed form and compare directly.

## Stating the three terms

A report that quotes a chance of a loss, a low case or a high case quotes the seed, the draws and the correlation beside it. Without them nobody can reproduce the figure. Each is a choice the analyst states.

## Exercise

Open the valuation calculator on the view "Risk sharing: spread, the chance of a loss, the low and high cases" and start from "One bet or four". Note the standard deviation and the chance of a loss for four prospects. Change "Seed (stated)" and read which figures move and which stay. Then set "Correlation, 0 to 1 (stated)" to a figure above 0 and read the standard deviation again. Start from "Four correlated bets" and compare. Finally set "Draws (stated)" above the most the holdings allow and read the refusal, then clear the seed control and read that refusal too.
