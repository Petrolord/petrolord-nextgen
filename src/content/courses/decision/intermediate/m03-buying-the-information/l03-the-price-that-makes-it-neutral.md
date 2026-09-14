# The price that makes it neutral

The survey price at which buying and deciding without the survey are worth the same is the survey's gross value. For EKPAN that price is 24.8250 million USD, and at it both root branches of the information tree are worth 75.7500.

{{panel:ec-information-explorer}}

## Setting the two branches equal

The acquire branch is evWithInfo less the price: 100.5750 less the cost. The no-information branch is emvPrior, 75.7500, and the price does not touch it. The two are equal when the price is 100.5750 less 75.7500, which is 24.8250, the EVII.

| survey cost | acquire branch value | no-information branch value | netEvii | root choice |
| --- | --- | --- | --- | --- |
| 24.0000 | 76.5750 | 75.7500 | 0.8250 | Acquire CSEM survey |
| 24.8250 | 75.7500 | 75.7500 | 0.0000 | Acquire CSEM survey |
| 28.0000 | 72.5750 | 75.7500 | -3.1750 | No further information |

## The tie goes to the first branch

At 24.8250 the two branches are exactly equal, and the engine keeps the first branch listed, the acquisition. The root choice reads "Acquire CSEM survey" beside a net value of 0.0000. That label is the listing order speaking; in value the engine is indifferent. The published costExactlyNetZero case shows the same behaviour: root branch values 43.0000 and 43.0000, bestBranchIndex 0 and a root of 43.0000. List the no-information branch first and the same numbers would recommend doing without.

## A ceiling for negotiation

Below 24.8250 the survey adds value on EMV grounds, and above it the survey destroys value. The neutral price depends on the prior, the likelihoods and the payoffs. It does not depend on the price a contractor quotes, and it is the most the survey is worth to this decision whatever the market charges for it.

## Why it is not the EVPI

EVPI, 52.0000, is the neutral price of a survey that never misreads. The CSEM survey does misread: it shows a bright spot on a dry prospect with likelihood 0.250000 and misses a success with likelihood 0.150000. Paying up to 52.0000 for it pays for accuracy it does not have. EVPI caps every survey on the decision; EVII caps this one.

## Why it is not evWithInfo

100.5750 is the value of the whole decision with the survey, and it contains the 75.7500 the prospect is worth without any survey. Treating it as the most one could pay would set the price where the acquire branch reaches zero, handing the survey contractor the prospect's own value as well as the survey's. The neutral price compares two branches with each other and never compares a branch with zero.

## The mistake

The careful error is to read the tie at 24.8250 as a recommendation to buy. At that price the value is identical either way, and a report that names "Acquire CSEM survey" reflects only the order in which the branches were listed. Nothing in the engine flags the tie: the report looks the same as at 8.0000, where the survey adds 16.8250. Read netEvii beside every root choice; a net value of 0.0000 means the recommendation carries no information about value.

## Exercise

Write the acquire branch and the no-information branch for EKPAN as expressions in the survey cost, set them equal and solve for the price. State the root choice and net value at that price and at 24.0000 and 28.0000, and explain why the root names the acquisition at 24.8250.
