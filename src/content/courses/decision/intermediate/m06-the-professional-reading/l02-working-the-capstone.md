# Working the capstone

An information capstone gives a lottery, a survey and a price, and asks what the survey is worth and whether to buy it. The order of work matters more than speed, and each step carries a check on the step before it. The EKPAN lottery shows the order.

{{panel:ec-information-explorer}}

## Step one: the choice at the prior

Value every action at the stated chances before touching the survey, charging each cost once, on its own branch. On the EKPAN lottery Drill is 75.7500, Farm out 33.2500 and Walk away 0.0000, so emvPrior is 75.7500 and the choice is Drill. Then find the switch: Drill = 445 p - 80 and Farm out = 95 p cross at 0.228571. Every later action choice asks which side of it a posterior lands on.

## Step two: the ceiling

Take the best action for each outcome and weight: 0.350000 x 365.0000 + 0.650000 x 0.0000 = 127.7500, so EVPI is 52.0000. Write it down before doing Bayes. A survey value that later exceeds it, or falls under 0, is wrong without a second calculation.

## Step three: Bayes one column at a time

Multiply each prior by each likelihood for the joint chances, add them for each signal, and divide.

| signal | joint with Success | joint with Dry hole | pSignal | posterior Success |
| --- | --- | --- | --- | --- |
| Bright spot | 0.297500 | 0.162500 | 0.460000 | 0.646739 |
| No bright spot | 0.052500 | 0.487500 | 0.540000 | 0.097222 |

Check twice: the signal chances sum to 1, and 0.460000 x 0.646739 + 0.540000 x 0.097222 returns the prior 0.350000. A posterior that fails has been divided by the wrong thing.

## Step four: act after each signal, then weight

Compare each posterior with the switch. 0.646739 is on the drill side, worth 207.7989; 0.097222 is on the farm-out side, worth 9.2361. Weight by pSignal, never by the prior:

0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750

EVII is 100.5750 less 75.7500 = 24.8250, and 0 <= 24.8250 <= 52.0000 holds.

## Step five: the price

Subtract the survey cost once, after the Bayes value: at 8.0000 the net value is 16.8250, and the information tree's root reads 92.5750 against 75.7500. State the neutral price, 24.8250, so the answer survives a changed quote.

## Use the panel to check, not to start

Work each step on paper, then set the same inputs in the explorer and compare line by line. Where they disagree, find the step: a joint chance, a posterior, an action, a weight. If an answer quotes the VOI Analyzer, count its actions, say which number is gross and which is net, and confirm its inputs are consistent before quoting a value.

## The mistakes that cost marks

- Weighting the post-signal values by the prior instead of by pSignal.
- Reading a likelihood as a posterior: 0.850000 in place of 0.646739 values Drill after a bright spot at 298.2500.
- Subtracting the survey cost inside each signal branch as well as at the root.
- Quoting a net value as the gross, or setting a net value beside EVPI.
- Reporting a value outside 0 to EVPI without noticing.
- Quoting the Analyzer's two-action 19.84 when the lottery has a third action.

## Exercise

Work the EKPAN lottery through all five steps on paper, writing each check as you pass it. Then set the same lottery and survey in the explorer, and for any line that disagrees name the step where the arithmetic went wrong.
