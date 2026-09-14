# A negative value of information

Information derived by Bayes can never be worth less than nothing, because a decision maker can always ignore it. Before the EC4-0 repair the VOI Analyzer printed a negative gross value of information for IRRI, and that number was impossible for exactly this reason.

{{panel:ec-judgement-explorer}}

## IRRI

IRRI is the Analyzer's default study: Drill Exploration Well at a cost of 40.0000, Success Case 30 percent paying 300.0000, Dry Hole 70 percent paying -50.0000, a 3D Seismic Survey costing 10.0000, and indicators Positive Seismic 40 percent and Negative Seismic 60 percent, both typed with outcome chances of 20 / 80 percent.

| card | the repaired Analyzer |
| --- | --- |
| EMV without information | 15.00 |
| EMV with information | withheld |
| value of information | withheld |
| net value of information | withheld |
| EVPI | 63.00 |

It reports consistent false and withheld true, draws no tree, and sets implied chances of 0.200000 / 0.800000 against a stated 0.300000 / 0.700000. Before the repair the same inputs printed a gross voi of -15.00 and a netVoi card of -25.00 (reconstructed from engine calls).

## Why ignoring a signal sets a floor

When posteriors are derived by Bayes, averaging them over the readings returns the prior. Taking the prior's best action after every reading therefore earns exactly EMV without information, and the best action after each reading does at least that well. The value is at least 0. The published uselessSignal case is the floor itself: both readings leave the posterior at 0.300000 / 0.700000, both lead to the same action worth 43.0000, and evii is 0.0000.

## Where -15.00 came from

IRRI's readings also all say the same thing, but they say 20 percent, not the stated 30. At 20 percent the drill action is worth less than Do Not, so after either reading the best action was Do Not, paying 0. A gross value of -15.00 against 15.00 without information means the with side came to 0, and the survey cost 10.0000 took the net to -25.00. Ignoring the readings no longer returned the 15.00 prospect; it returned a 20 percent prospect nobody stated. The published identicalPosteriorsWithheld case printed the same -15.00.

## Negative net is ordinary, negative gross is not

A negative net value is a legitimate answer. The published pricey case charges 50.0000 for the default survey, whose gross value is 33.00, and prints a netVoi card of -17.00 with a verdict that acquiring it is not justified. A negative net value says the price is too high. A negative gross value says the inputs contradict each other.

## The mistake

The careful mistake is to explain -15.00 as a survey that misleads, and conclude that information can hurt. In this risk neutral accounting a free signal cannot hurt: a misleading survey shows up as posteriors that barely move, and those are worth 0. The repaired Analyzer withholds the value, names the implied chances beside the stated ones, and leaves the correction to whoever typed them.

## Exercise

Write IRRI's implied and stated outcome chances and the two cards the repaired Analyzer still shows. Then explain why a gross value of information derived by Bayes cannot be negative, and why the netVoi card of -17.00 on the pricey case is a different kind of number from the -15.00 printed for IRRI before the repair.
