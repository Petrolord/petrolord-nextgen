# Knowing the outcome first

Perfect information is a thought experiment: someone tells you how the prospect will turn out before you choose what to do about it. Its value is the ceiling on what any survey, well test or study can be worth on the same decision.

{{panel:ec-information-explorer}}

## The EKPAN lottery

The information explorer works on EKPAN reduced to a lottery of two outcomes, Success and Dry hole, with success at 0.350000 and dry hole at 0.650000. There are three actions. Drill costs 55.0000 million USD and pays 420.0000 or -25.0000. Farm out pays 95.0000 or 0.0000. Walk away pays 0.0000 either way. The lottery has no marginal find, so its value at the prior is 75.7500, a different number from the full EKPAN tree's 105.0000. Keep the two apart.

| action | Success net | Dry hole net | value at 0.350000 |
| --- | --- | --- | --- |
| Drill | 365.0000 | -80.0000 | 75.7500 |
| Farm out | 95.0000 | 0.0000 | 33.2500 |
| Walk away | 0.0000 | 0.0000 | 0.0000 |

## Choosing before the outcome

Without information the order is decide, then learn. You pick one action and live with both of its outcomes. The engine weights each row by the prior and takes the maximum: Drill at 75.7500 against Farm out at 33.2500 and Walk away at 0.0000. That maximum is emvPrior, and its best action is Drill. Drill is chosen knowing that it loses 80.0000 with probability 0.650000.

## Choosing after the outcome

Perfect information reverses the order: learn, then decide. The chance node moves in front of the decision, and a separate decision is made on each outcome branch. When the outcome will be Success, the best action is Drill at 365.0000. When it will be Dry hole, nothing beats 0.0000, and the engine reports Farm out. Weighting those two best values by the same priors gives evWithPerfect:

0.350000 x 365.0000 + 0.650000 x 0.0000 = 127.7500

The priors do not change. Perfect information announces Success 0.350000 of the time and Dry hole 0.650000 of the time, exactly as often as the prospect delivers them. What changes is that the action now fits the outcome.

## What it refuses to be

evWithPerfect is not a forecast, and no single well earns 127.7500. It is the expectation of a strategy nobody can buy, because no survey reads the rock perfectly. The engine is risk neutral and does no discounting: the payoffs arrive already discounted, and the calculation maximises expected money without asking whether a loss of 80.0000 would hurt the company that takes it.

## The mistake

A careful person often reads perfect information as raising the chance of success, and reprices the prospect as if success had probability 1, at the Drill outcome of 365.0000. That is the value of a prospect known to succeed, which EKPAN is not: it is dry 0.650000 of the time either way. The second error quotes 127.7500 as the worth of the information. It is the value of the decision made with the information. The worth of the information is only what that adds over 75.7500, and that difference is EVPI, 52.0000.

## Exercise

For the EKPAN lottery at a success probability of 0.350000, write emvPrior by taking the best of the three action values. Then write evWithPerfect by taking the best net value for each outcome and weighting by the priors. Say which action the engine reports if Dry hole is announced, and explain why the priors in the second line are the same as those in the first.
