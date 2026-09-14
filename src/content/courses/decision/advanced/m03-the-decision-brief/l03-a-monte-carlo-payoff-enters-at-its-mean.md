# A Monte Carlo payoff enters at its mean

A terminal payoff in a decision tree can be a linked Monte Carlo NPV summary instead of a single number. The rollback is linear, so only the summary's mean enters, and the spread travels with the tree without moving its EMV.

{{panel:ec-judgement-explorer}}

## EKPAN with a linked payoff

EKPAN's success payoff is replaced by the summary {"mean":420,"p90":185,"p50":390,"p10":710}. Under the exceedance convention the NPV P90 of 185.0000 is the low case and the NPV P10 of 710.0000 the high case. The tree rolls back to 105.0000 with Drill first, identical to the plain payoff of 420.0000, and Decision Studio's brief prints Optimal EMV 105.0000.

## Why only the mean

A chance node is a probability-weighted sum. Taking the expectation of that sum with a random payoff inside it gives the same sum with the payoff's mean in its place, so no other statistic can move the root. The P90 and P10 are carried for the reader; the rollback never looks at them.

## Reading the wrong statistic

| success payoff read at | payoff | Drill branch value | root emv | best |
| --- | --- | --- | --- | --- |
| mean | 420.0000 | 105.0000 | 105.0000 | Drill |
| NPV P90 (low case) | 185.0000 | 22.7500 | 37.7500 | Farm out |
| NPV P50 | 390.0000 | 94.5000 | 94.5000 | Drill |
| NPV P10 (high case) | 710.0000 | 206.5000 | 206.5000 | Drill |

At the NPV P90 by hand: 0.350000 x 185.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000, less the drill cost 55.0000, gives 22.7500. The farm-out is worth 37.7500, so the root switches to Farm out. A low case typed in as the payoff has quietly changed the decision.

## What is copied, and what is refused

In the Decision Tree Builder, linking a saved Monte Carlo run to a terminal stores a copy of the run's NPV mean, P90 and P10 in million USD at the moment of linking. Nothing re-reads the run, so a revalued run must be linked again before the tree sees it, and unlinking keeps the mean as a fixed payoff. A summary with no mean is refused with "Distribution payoff has no finite mean": the engine will not guess a mean from the percentiles.

The engine is risk neutral. Two summaries with the same mean roll back to the same EMV however far apart their low cases sit.

## The mistake

The careful mistake is to use the NPV P50 because it is the middle case. On this summary the NPV P50 of 390.0000 sits below the mean of 420.0000, and the tree falls to 94.5000. The decision survives, but the value is understated by a statistic the rollback was never meant to take. The second mistake is to feed in the NPV P90 as a prudent payoff: 185.0000 is a low outcome of the run, and averaging it as if it were the expected payoff flips the choice to Farm out.

P-labels belong to the NPV summary alone. The success chance of 0.350000 on the same tree is a plain probability.

## Exercise

State EKPAN's root emv and best action with the success payoff at the summary's mean and at its NPV P90, and write the weighting line for the NPV P90 case. Then explain why the NPV P10 of 710.0000 has no effect on the tree's EMV when the summary is linked.
