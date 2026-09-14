# The chance of each signal

Before the EKPAN survey is shot, a bright spot is 0.460000 likely and no bright spot 0.540000 likely. Those chances come from the prior and the likelihoods together, and they are the weights the value of information is built on.

{{panel:ec-information-explorer}}

## Joint chances

| signal | joint with Success | joint with Dry hole | pSignal |
| --- | --- | --- | --- |
| Bright spot | 0.297500 | 0.162500 | 0.460000 |
| No bright spot | 0.052500 | 0.487500 | 0.540000 |

Each joint cell is the outcome's prior times the likelihood of the reading given that outcome. A bright spot with Success is 0.350000 x 0.850000 = 0.297500. A bright spot with Dry hole is 0.650000 x 0.250000 = 0.162500. Their sum, 0.297500 + 0.162500 = 0.460000, is the chance of a bright spot. For no bright spot, 0.350000 x 0.150000 = 0.052500 and 0.650000 x 0.750000 = 0.487500, together 0.540000.

## Two ways to see a bright spot

A bright spot happens on successes and on dry holes alike. Of every prospect like EKPAN, 0.297500 succeed and show one, and 0.162500 are dry and show one anyway. The false alarm rate of 0.250000 is modest, but it is applied to the large 0.650000 of dry outcomes, so dry holes supply a substantial share of all bright spots. That share, 0.162500 of the 0.460000, is what keeps a bright spot from settling the question.

## Checks that come free

The two signal chances, 0.460000 and 0.540000, sum to 1 because every prospect shows one reading or the other. The joint columns return the priors: 0.297500 + 0.052500 = 0.350000 for Success, and 0.162500 + 0.487500 = 0.650000 for Dry hole. A hand calculation that fails either check has a wrong cell in it.

## What the chance of a signal depends on

pSignal belongs to the survey applied to this prospect. The same likelihoods on a prospect with a different prior give a different chance of a bright spot, because the weights on the hit rate and the false alarm rate change. The published seismicBayes case, a different prospect with a different survey, reads its positive signal at 0.450000 and its negative at 0.550000. A hit rate on its own cannot say how often the reading will be seen.

## Where the weights are used

evWithInfo weights the value of the best action after each reading by that reading's chance:

0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750

Weighting by anything else, the likelihoods or two equal halves, produces a number the engine never computes and no survey delivers.

## The mistake

Two wrong answers recur. The first takes 0.850000 as the chance of seeing a bright spot. That counts only the successes and forgets every false alarm on a dry hole, and it cannot be right: it is the chance of a bright spot on a prospect known to succeed. The second adds the likelihoods along a row, 0.850000 and 0.250000, which mixes two different outcomes without weighting them by how often each occurs; that sum is not the chance of anything. The correct route weights each likelihood by its outcome's prior first, then adds.

## Exercise

Build the four joint cells for EKPAN from the prior 0.350000 and the likelihoods 0.850000, 0.250000, 0.150000 and 0.750000. Add them to get the chance of each signal, check that the columns return the priors, and say how much of the 0.460000 chance of a bright spot comes from dry holes.
