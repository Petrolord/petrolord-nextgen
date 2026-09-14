# EVPI as a difference

The expected value of perfect information is the value of deciding after the outcome is known less the value of deciding before it. On the EKPAN lottery at a success probability of 0.350000 that is 127.7500 less 75.7500, which is 52.0000 million USD.

{{panel:ec-information-explorer}}

## Two decisions, one lottery

| quantity | value | action |
| --- | --- | --- |
| emvPrior | 75.7500 | Drill for every outcome |
| evWithPerfect | 127.7500 | Drill on Success, Farm out on Dry hole |
| evpi | 52.0000 | the difference |

emvPrior takes the maximum over actions after weighting. evWithPerfect weights after taking the maximum in each outcome. EVPI is what that change of order is worth.

## Where the 52.0000 comes from

The difference can be read outcome by outcome. The prior best action is Drill. On Success, perfect information also says Drill, so knowing changes nothing: 365.0000 either way. On Dry hole, knowing moves the choice from Drill at -80.0000 to Farm out at 0.0000, a gain of 80.0000. That gain happens only on the dry hole, so it is weighted by the dry hole's probability:

0.650000 x 80.0000 = 52.0000

It is the same number as 127.7500 less 75.7500. EVPI is the expected regret of the prior choice: what the prior best action gives up in the outcomes where it is wrong, weighted by how often those outcomes occur.

## A ceiling

No information about EKPAN can be worth more than 52.0000. The CSEM survey on the same lottery, with likelihoods 0.850000 and 0.250000, is worth 24.8250, inside the ceiling. A value of information above 52.0000 on this decision is an error in the inputs or the arithmetic, and a price above 52.0000 for any study of it can be refused before any Bayes is done.

## Published cases

| case | emvPrior | evWithPerfect | evpi |
| --- | --- | --- | --- |
| prospect | 43.0000 | 78.0000 | 35.0000 |
| voiDefaultLottery | 15.0000 | 78.0000 | 63.0000 |
| distributionPayoffs | 43.0000 | 78.0000 | 35.0000 |

All three reach the same evWithPerfect of 78.0000, and their EVPIs differ because the decision without information differs. A prior decision worth 43.0000 leaves 35.0000 to gain; one worth 15.0000 leaves 63.0000. distributionPayoffs matches the prospect because a distribution payoff enters at its mean.

## What it leaves out

EVPI is gross: it charges nothing for the information. It is risk neutral, so avoiding a loss of 80.0000 counts only at its expectation. It does no discounting, and it assumes the outcome is known before the action is taken.

## The mistake

The wrong answer is usually the wrong baseline. EVPI subtracts the value of the best action at the prior, 75.7500. A reader who subtracts the farm-out's 33.2500, reasoning that perfect information sometimes recommends the farm-out, overstates the value by crediting the information with Drill's advantage over Farm out, which the company already has without it. A reader who quotes evWithPerfect, 127.7500, as the value of information credits it with the whole prospect. The baseline is always the best decision available today.

## Exercise

Compute EVPI for EKPAN at 0.350000 twice: once as evWithPerfect less emvPrior, and once as the dry hole probability times the gain from switching on a dry hole. Then use the prospect and voiDefaultLottery rows to explain how one evWithPerfect carries two different EVPIs.
