# A cost sweep

Sweeping the survey cost moves only one branch of the information tree. For EKPAN the acquire branch falls one for one with the price while the no-information branch holds at 75.7500 million USD, and the root choice flips once, between 24.8250 and 28.0000.

{{panel:ec-information-explorer}}

## The sweep

| survey cost | acquire branch value | no-information branch value | netEvii | root choice |
| --- | --- | --- | --- | --- |
| 0.0000 | 100.5750 | 75.7500 | 24.8250 | Acquire CSEM survey |
| 4.0000 | 96.5750 | 75.7500 | 20.8250 | Acquire CSEM survey |
| 8.0000 | 92.5750 | 75.7500 | 16.8250 | Acquire CSEM survey |
| 12.0000 | 88.5750 | 75.7500 | 12.8250 | Acquire CSEM survey |
| 16.0000 | 84.5750 | 75.7500 | 8.8250 | Acquire CSEM survey |
| 20.0000 | 80.5750 | 75.7500 | 4.8250 | Acquire CSEM survey |
| 24.0000 | 76.5750 | 75.7500 | 0.8250 | Acquire CSEM survey |
| 24.8250 | 75.7500 | 75.7500 | 0.0000 | Acquire CSEM survey |
| 28.0000 | 72.5750 | 75.7500 | -3.1750 | No further information |
| 32.0000 | 68.5750 | 75.7500 | -7.1750 | No further information |

## What moves and what does not

The acquire branch starts at 100.5750 at no cost and is lower by exactly the cost in every row. The no-information branch is 75.7500 in every row, because it never touches the survey. netEvii is their difference and falls in the same steps, from 24.8250 to -7.1750.

Nothing inside the survey branch responds to the price. The chance of a bright spot stays 0.460000, the success posteriors stay 0.646739 and 0.097222, the actions after the two readings stay Drill and Farm out, and the gross value stays 24.8250. The price is paid before any reading, so it cannot change what a reading says or what is best to do after it.

## The flip

The root chooses "Acquire CSEM survey" up to and including 24.8250, where the branches tie and the first listed is kept, and "No further information" at 28.0000 and 32.0000. The root value is the larger branch: 92.5750 at a cost of 8.0000, and 75.7500 once the survey is dearer than its gross value. The root never falls below 75.7500, because declining the survey is always available.

## Published cases

| case | acquire branch | no-information branch | bestBranchIndex | root emv |
| --- | --- | --- | --- | --- |
| seismicCost5 | 50.5000 | 43.0000 | 0 | 50.5000 |
| costExactlyNetZero | 43.0000 | 43.0000 | 0 | 43.0000 |
| seismicCost20 | 35.5000 | 43.0000 | 1 | 43.0000 |

The same pattern holds on the published seismic prospect. Its survey's evWithInfo is 55.5000, so each acquire branch is 55.5000 less the price, while the no-information branch stays at 43.0000 in every case. The exact tie keeps the first branch listed, and the dearer survey sends the root back to 43.0000.

## What the sweep assumes

The sweep is a straight line because the engine is risk neutral and the cost is one undiscounted amount on the root branch. It holds the survey's quality fixed, so it cannot say whether a cheaper survey with weaker likelihoods would do better; every quality needs its own tree.

## The mistake

The careful error is to read the netEvii column as the survey's value shrinking as its price rises. The gross value is 24.8250 in every row; only the net moves. The second error reads the root value as the survey's value. At 32.0000 the root is a healthy 75.7500 on a survey whose net value is -7.1750.

## Exercise

From the sweep, give the acquire branch, the net value and the root choice at survey costs of 16.0000, 24.8250 and 32.0000. Name every quantity that stays fixed across the sweep, and explain why the root value never falls below 75.7500.
