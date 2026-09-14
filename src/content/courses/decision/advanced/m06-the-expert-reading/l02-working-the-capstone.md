# Working the capstone

An expert case hands you typed numbers and asks what information is worth. It is worked in a fixed order, and the tool's cards come last. The order is worked here on the EKPAN lottery and IRRI.

{{panel:ec-judgement-explorer}}

## First, are they chances?

Add every set of percents before running anything: the outcome chances, the indicator chances, and the outcome chances given each indicator, each to 100, with every entry between 0 and 100. EKPAN typed with No bright spot at 64 percent beside a Bright spot of 46.000000 percent is refused: `Indicator chances sum to 110 percent, expected 100`. A refused case has no value; the answer is the message and the box at fault.

## Second, do they agree?

Rebuild the implied prior by hand. For the EKPAN lottery's survey, 0.460000 x 0.646739 gives 0.297500, 0.540000 x 0.097222 gives 0.052500, and the sum is 0.350000, the stated prior. The delta sits inside 0.005, so the case is consistent. For IRRI the same arithmetic gives 0.200000 against a stated 0.3, and the value of information is withheld. Write the two numbers that survive, EMV without information 15.00 and EVPI 63.00, and say in words that the rest is withheld and why. Never compute the withheld value yourself: a number built from those inputs is what the Analyzer printed before the repair, -15.00.

## Third, the decision without information

Value every action, including one that can never win. On the EKPAN lottery at 0.35: Drill 75.7500, Farm out 33.2500, Walk away 0.0000. Check the margin for a tie, because a tie goes to the branch listed first. On a bigger lottery, list the action that is never best too, such as Drill with partner at 54.5000 beside Drill alone at 109.0000.

## Fourth, perfect then imperfect

Perfect information takes the best action for each outcome: Drill after Success at 365.0000, and 0.0000 after a dry hole, where Farm out and Walk away tie. That gives 0.350000 x 365.0000, which is 127.7500, less 75.7500: an EVPI of 52.0000.

Imperfect information goes through Bayes. After a bright spot, with probability 0.460000 and a posterior of 0.646739, Drill is worth 207.7989. After no bright spot, with probability 0.540000 and a posterior of 0.097222, Farm out is worth 9.2361. Weighting gives 100.5750; less 75.7500 gives an EVII of 24.8250, inside its bounds of 0 and 52.0000. At a cost of 8.0000 the net value is 16.8250, and the price that makes the survey neutral is the gross 24.8250.

## Fifth, the tool

Only now read the Analyzer. The EKPAN lottery typed into it gives a gross voi of 19.84, a netVoi card of 11.84 and an evpi card of 52.00. The 19.84 is the two-action value, because the Analyzer cannot offer the farm-out.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Chances | every set of percents sums to 100, every entry between 0 and 100 |
| Agreement | implied priors by hand, each delta against 0.005, a withholding said in words |
| Prior decision | every action valued, the margin written, any tie named |
| Perfect information | the best action per outcome, EVPI as a difference |
| Imperfect information | the chance of each reading, its posterior, its best action, EVII inside its bounds |
| Price and tool | gross beside net, a two-action card called two-action, a card near zero read against the cost |

## The mistake

The careful mistake is the right number under the wrong question: 19.84 where the full lottery is asked, a withheld value written as 0.00, or the likelihood 0.850000 read as a posterior, which values the drill after a bright spot at 298.2500 instead of 207.7989.

## Exercise

Work the EKPAN lottery in the five steps, writing each implied prior, the three action values, EVPI, both posteriors and EVII. Then work IRRI to the second step and write exactly what can and cannot be reported.
