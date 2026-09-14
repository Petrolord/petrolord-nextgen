# A payoff that is a distribution

A terminal can carry a Monte Carlo summary instead of a single number, and the rollback uses only its mean. The spread travels with the payoff and moves no EMV.

{{panel:ec-tree-explorer}}

## The EKPAN tree with a linked summary

Replace the EKPAN tree's drill success payoff of 420.0000 million USD with a linked NPV summary whose mean is 420, P90 185, P50 390 and P10 710. P90 is the low case and P10 the high case, under the exceedance meaning. The tree rolls back to 105.0000, identical to the plain 420.0000 payoff, because only the mean enters the weighting. The published distributionPayoff case shows the same behaviour on a smaller tree, rolling back to 75.0000 against its golden 75.0000.

## Reading the wrong statistic

The same tree with the success payoff read at each statistic of the summary:

| payoff read at | success payoff | Drill branch value | tree EMV | best |
| --- | --- | --- | --- | --- |
| mean | 420.0000 | 105.0000 | 105.0000 | Drill |
| P90 | 185.0000 | 22.7500 | 37.7500 | Farm out |
| P50 | 390.0000 | 94.5000 | 94.5000 | Drill |
| P10 | 710.0000 | 206.5000 | 206.5000 | Drill |

At the P90 the drill branch falls to 22.7500, below the farm-out's 37.7500, and the recommendation flips. At the P10 it rises to 206.5000. Neither is the drill's value. A chance node is linear in its payoffs, so the mean is the one statistic that gives the right expected value, and the rest of the summary cannot change it.

## Why the mean and nothing else

The success payoff is uncertain inside its own branch, and averaging over the summary before or after weighting by 0.350000 gives the same number, so the tree needs the mean alone and loses any view of how wide the summary is. A success with a P90 of 185 and a P10 of 710 and a success worth exactly 420 produce the same 105.0000.

## Where the summary comes from

Linking a saved Monte Carlo run in the Decision Tree Builder stores a copy of its NPV mean, P90 and P10 at that moment. Nothing re-reads the run, so a revalued run must be linked again. Unlinking keeps the mean as a fixed payoff.

## The mistake

The careful mistake is typing the P50 as the payoff because it is the middle of the distribution. It gives 94.5000, an EMV below the true 105.0000, and on a closer choice that shortfall could flip the move. The more tempting mistake is reading the P90 to be conservative. It flips the EKPAN tree to the farm-out at 37.7500 and calls a risk preference an expected value. The engine is risk neutral and has nowhere to put caution.

## What it refuses

A summary with no mean, carrying only a P90 of 185, a P50 of 390 and a P10 of 710, is refused with `Distribution payoff has no finite mean`. The engine does not estimate a mean from the percentiles.

## Exercise

Roll back the EKPAN tree with the success payoff at the summary's mean and at its P90, showing the drill weighting line for each. Say which move is recommended in each case, and explain why the mean is the only statistic the rollback needs.
