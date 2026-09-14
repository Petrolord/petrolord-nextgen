# Useless and perfect signals

The two ends of the accuracy dial are exact. A useless signal leaves every posterior at the prior and is worth 0.0000; a perfect signal turns Bayes into perfect information and is worth the EVPI.

{{panel:ec-information-explorer}}

## The coin

A signal is useless when each reading is equally likely whatever the truth. On the EKPAN lottery at accuracy 0.500000 the chance of a success reading is 0.500000, both success posteriors are 0.350000, Drill follows both readings, and evii is 0.0000.

The published uselessSignal case does the same on its own prospect. Heads and Tails each leave the posteriors at 0.300000 and 0.700000 and choose action 0 at 43.0000, so evWithInfo is 0.500000 x 43.0000 + 0.500000 x 43.0000 = 43.0000, the value without the signal. evii is 0.0000.

| case | reading | pSignal | posteriors | best | emv |
| --- | --- | --- | --- | --- | --- |
| uselessSignal | Heads | 0.500000 | 0.300000 / 0.700000 | 0 | 43.0000 |
| uselessSignal | Tails | 0.500000 | 0.300000 / 0.700000 | 0 | 43.0000 |
| perfectSignal | Says success | 0.300000 | 1.000000 / 0.000000 | 0 | 260.0000 |
| perfectSignal | Says dry | 0.700000 | 0.000000 / 1.000000 | 1 | 0.0000 |

## The oracle

A signal is perfect when each reading occurs under one outcome only. On the EKPAN lottery at accuracy 1.000000 the success reading arrives with pSignal 0.350000, exactly the prior, and the posteriors are 1.000000 and 0.000000. evii is 52.0000, the EVPI.

In perfectSignal, "Says success" arrives with 0.300000, the prior, so evWithInfo is 0.300000 x 260.0000 + 0.700000 x 0.0000 = 78.0000, the published prospect's evWithPerfect of 78.0000, and evii is 35.0000, its evpi of 35.0000. A perfect signal's Bayes calculation reproduces the perfect-information table row for row.

## Useless and worthless are different

A useless signal cannot move belief. A worthless one moves belief and changes nothing. The EKPAN lottery at accuracy 0.600000 moves success to 0.446809 or 0.264151, it is informative, and evii is 0.0000 because Drill follows both readings.

Perfect information itself can be worthless. The published dominantAction lottery has emvPrior 65.0000 and evWithPerfect 65.0000, so evpi is 0.0000: one action is best whatever happens. The certainOutcome lottery has emvPrior and evWithPerfect both 260.0000, and evpi 0.0000: there is nothing left to learn. Since 0 <= evii <= evpi, when evpi is 0.0000 every signal on that lottery is worth 0.0000, however accurate.

## The mistake

The careful mistake is calling a signal perfect when its success reading arrives more or less often than success itself: then some readings are wrong. The second mistake is treating a cheap coin as a bargain. Its gross value is 0.0000, so any cost at all makes the net value negative.

## What it refuses

The engine insists that each outcome's likelihoods sum to 1, and refuses a column that does not with a message such as "Likelihoods P(signal | "Dry hole") sum to 1.200000, expected 1". A perfect signal is typed as columns of 1 and 0.

## Exercise

For perfectSignal, write evWithInfo by hand and name the two published numbers it equals. Then explain why the EKPAN lottery at accuracy 0.600000 is informative and still worth 0.0000, and why no signal on the dominantAction lottery can be worth anything.
