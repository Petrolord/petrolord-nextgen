# Posteriors

A posterior is the chance of an outcome after the reading is seen. On EKPAN a bright spot lifts the chance of success from 0.350000 to 0.646739, and no bright spot drops it to 0.097222.

{{panel:ec-information-explorer}}

## Bayes in one division

Each posterior is a joint chance divided by the chance of the reading.

| signal | joint with Success | joint with Dry hole | pSignal | posterior Success | posterior Dry hole |
| --- | --- | --- | --- | --- | --- |
| Bright spot | 0.297500 | 0.162500 | 0.460000 | 0.646739 | 0.353261 |
| No bright spot | 0.052500 | 0.487500 | 0.540000 | 0.097222 | 0.902778 |

After a bright spot, 0.297500 / 0.460000 = 0.646739 and 0.162500 / 0.460000 = 0.353261. After no bright spot, 0.052500 / 0.540000 = 0.097222 and 0.487500 / 0.540000 = 0.902778. Each pair of posteriors sums to 1, because after any reading the prospect still either succeeds or is dry.

## Reading the numbers

The survey is good, and a bright spot still leaves a dry hole 0.353261 likely. Dry outcomes are so common at the prior that their false alarms make up that share of all bright spots. The absence of a bright spot is the more decisive reading: success falls to 0.097222, because a success shows a bright spot 0.850000 of the time, so not seeing one is strong evidence against it.

## Posteriors average back to the prior

Weight the two success posteriors by the chance of each reading and the prior returns: 0.460000 x 0.646739 + 0.540000 x 0.097222 gives back 0.350000. A survey moves belief up on one reading and down on the other, and on average moves it nowhere. That is why a survey cannot make a prospect more likely to succeed in expectation. What it can do is let the action fit the reading, and that is the only place its value comes from.

## Dividing by the right number

The posterior divides the joint by pSignal, the chance of the reading. Dividing the same joint by the prior goes in a circle: 0.297500 over 0.350000 gives back 0.850000, the likelihood the calculation started from. A reader who finishes a Bayes calculation holding the hit rate has divided by the wrong number.

## What the engine guarantees

The engine computes posteriors at full precision from the prior and the likelihoods, and the lab prints them to six decimals. Because every posterior is derived from one prior, the average back to the prior always holds. Typed posteriors carry no such guarantee: rounded, or copied from another study, they can imply a different prior from the one stated. That is why the VOI Analyzer checks typed numbers for consistency, while this engine has nothing to check. A posterior is a plain probability and takes no percentile label. The engine is also single stage: one survey, read once, then one action.

## The mistake

Reading the likelihood as the posterior is the expensive error. Put 0.850000 on the success branch after a bright spot and Drill is worth 298.2500; the posterior 0.646739 gives 207.7989. The overstatement lands on the reading that argues for drilling, so it pushes the decision the way a hopeful team already leans. The hit rate describes the survey given the rock; the decision needs the rock given the survey.

## Exercise

From the joint cells 0.297500, 0.162500, 0.052500 and 0.487500 and the signal chances 0.460000 and 0.540000, compute all four posteriors. Show that the success posteriors average back to 0.350000, and explain why dividing 0.297500 by 0.350000 is the wrong division.
