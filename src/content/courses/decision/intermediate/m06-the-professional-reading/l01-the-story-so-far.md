# The story so far

This tier priced information on one model, the EKPAN lottery, and every step came back to one idea: information is worth what it can change in the choice, weighted by how often it changes it.

## The choice without information

The EKPAN lottery has two outcomes and no later decision. Drill costs 55.0000 and pays 420.0000 on a success or -25.0000 on a dry hole; Farm out pays 95.0000 or 0.0000; Walk away pays nothing. At a success prior of 0.350000 Drill is worth 75.7500 and Farm out 33.2500, so emvPrior is 75.7500. The two lines cross at 80 / 350 = 0.228571, the switch every later step leans on.

## Perfect information

Knowing the outcome first gives each outcome its own best action: Drill for 365.0000 on a known success, Farm out for 0.0000 on a known dry hole.

0.350000 x 365.0000 + 0.650000 x 0.0000 = 127.7500

EVPI is 127.7500 less 75.7500 = 52.0000, the ceiling on any survey. It peaks at 61.7143 at the switch probability, and it is 0.0000 wherever one action wins every outcome, as in the published dominantAction lottery.

## Imperfect information by Bayes

The CSEM survey shows a bright spot over 0.850000 of successes and 0.250000 of dry holes.

| signal | pSignal | posterior Success | best action | emv |
| --- | --- | --- | --- | --- |
| Bright spot | 0.460000 | 0.646739 | Drill | 207.7989 |
| No bright spot | 0.540000 | 0.097222 | Farm out | 9.2361 |

0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750, so evii is 24.8250, inside 0 <= 24.8250 <= 52.0000. Reading the likelihood 0.850000 as the posterior would value Drill after a bright spot at 298.2500.

## Buying it

At a survey cost of 8.0000 the net value is 16.8250, and the information tree shows it as a choice at its root: acquire at 92.5750 against no further information at 75.7500. The neutral price is the gross value, 24.8250, where the root branches tie and the engine keeps the acquisition, listed first.

## Accuracy

A symmetric survey is worth 0.0000 until a dry reading can carry success under 0.228571. At accuracy 0.600000 it moves belief and buys nothing; the action first changes at 0.645051, and the value then climbs in equal steps to 52.0000 at a perfect reading.

## The Analyzer

The VOI Analyzer takes posteriors as typed percents and offers two actions. The EKPAN lottery typed into it gives a gross value of 19.84 and a net value of 11.84, because after no bright spot it can only walk away. Its panel shows four cards, and the gross value is not one of them. The repaired Analyzer refuses percents that are not distributions and withholds the value when typed indicators contradict the stated chances, as on IRRI.

## What none of it does

Every number here is risk neutral and undiscounted. The engines maximise the mean, keep the first branch in a tie, and refuse or withhold what cannot be true without repairing it.

## Exercise

Without the panel, write the EKPAN lottery's emvPrior, evWithPerfect, EVPI, evWithInfo, EVII and net EVII at a survey cost of 8.0000, each with its line. Then explain in two sentences why the Analyzer's 19.84 differs from 24.8250.
