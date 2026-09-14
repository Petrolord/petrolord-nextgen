# Onward

The Associate reading ends with a choice and the probability at which it would turn. The Professional tier asks the next question: what is it worth to learn the outcome, or part of it, before choosing?

## Perfect information

On the EKPAN lottery at a success probability of 0.350000 the best action is Drill at 75.7500 million USD. If the outcome were known first, the company would drill on success for 365.0000 and farm out on a dry hole for 0.0000:

| outcome | probability | best action if known | best value |
| --- | --- | --- | --- |
| Success | 0.350000 | Drill | 365.0000 |
| Dry hole | 0.650000 | Farm out | 0.0000 |

Weighted, 0.350000 x 365.0000 + 0.650000 x 0.0000 = 127.7500. Less the 75.7500 available without it, perfect information is worth 52.0000, the expected value of perfect information, EVPI. It is largest at the switch point this tier found: 61.7143 at 0.228571.

## A survey that is only partly right

No survey is perfect. EKPAN's survey sees a bright spot on 0.850000 of successes and on 0.250000 of dry holes. By Bayes a bright spot turns up with probability 0.460000 and lifts success to 0.646739, and the value of that imperfect information is 24.8250, below the EVPI of 52.0000 and above zero. At a survey cost of 8.0000 the net value is 16.8250, and 24.8250 is the price at which buying it and not buying it tie.

## What carries straight over

The information tree is rolled back by the same engine this tier used: a decision to survey, a chance node for the reading, a decision after each reading. Its root is worth 92.5750, the survey branch 100.5750 less its cost of 8.0000. At a survey cost of exactly 24.8250 its two root branches tie, and the engine keeps the first listed, the acquisition: the tie rule again. OKRIKA's appraisal already showed the idea in miniature: 15.6000 when its result cannot change the action, and 87.0000 when a poor result leads to a sale.

## What the Expert tier adds

Numbers that cannot all be true. The VOI Analyzer offers two actions only, so EKPAN typed into it shows a gross voi of 19.84. On IRRI its typed inputs contradict the stated chances, and the repaired Analyzer withholds the value of information rather than printing one. Before the repair it printed a gross value of information of -15.00 there, a number Bayes can never produce, because information derived from chances that agree is never worth less than 0.

## Exercise

Write EKPAN's lottery values with the outcome known in advance, and compute the EVPI at 0.350000. Then give the value of the survey before and after its cost of 8.0000, and say why it can never exceed 52.0000.
