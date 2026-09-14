# When perfect information is worthless

Perfect information is worth 0.0000 when knowing the outcome could not change the action. Two published cases reach that zero, and the EKPAN lottery shows how close to it a decision can come.

{{panel:ec-information-explorer}}

## Two published zeros

| case | emvPrior | evWithPerfect | evpi |
| --- | --- | --- | --- |
| dominantAction | 65.0000 | 65.0000 | 0.0000 |
| certainOutcome | 260.0000 | 260.0000 | 0.0000 |

evWithPerfect equals emvPrior exactly when the prior best action is also a best action in every outcome that can occur. Then the maximum in each outcome picks a value no better than that action's own, and weighting returns the prior value.

## An action that wins everywhere

When one action is best in every outcome, the payoff can still swing widely and the outcome can still be unknown, yet the decision is settled. Knowing which outcome arrives would leave you doing what you were already going to do, and dominantAction's EVPI of 0.0000 is that statement in numbers.

## An outcome that is certain

When one outcome has probability 1, there is nothing to reveal. The best action at the prior is already the best action for the only outcome that can happen, and certainOutcome returns 260.0000 on both sides of the difference.

## Close to worthless on EKPAN

| success probability | emvPrior | evWithPerfect | evpi |
| --- | --- | --- | --- |
| 0.050000 | 4.7500 | 18.2500 | 13.5000 |
| 0.350000 | 75.7500 | 127.7500 | 52.0000 |
| 0.900000 | 320.5000 | 328.5000 | 8.0000 |

At 0.900000 Drill is best at the prior and only the rare dry hole would change it. At 0.050000 Farm out is best and only the rare success would change it.

## Never below zero

evWithPerfect can never be less than emvPrior: in every outcome the best value is at least the prior best action's value, and weighting by probabilities cannot reverse an inequality that holds in every outcome. An EVPI below 0.0000 is therefore an error in the inputs or the arithmetic.

## What follows for any survey

A zero EVPI closes the question for every kind of information on that decision. Imperfect information is bounded by perfect information, so no survey, however accurate, can be worth more than 0.0000 there, and on EMV grounds the right price for a study of it is nothing.

## The mistake

The tempting argument says the outcome is uncertain, so learning it must be worth something. dominantAction is uncertain and knowing its outcome is worth 0.0000. The test is whether some outcome would make a different action best, and the size of the payoff swing does not enter it. The opposite mistake reads EKPAN's 8.0000 at 0.900000 as proof that drilling is safe. The small EVPI says the choice is rarely wrong; Drill still loses 80.0000 on the dry hole when it comes.

## Exercise

For dominantAction and certainOutcome, state emvPrior, evWithPerfect and EVPI, and give the condition that makes each EVPI 0.0000. Then, for EKPAN at 0.050000 and 0.900000, name the prior best action and the outcome in which perfect information would change it.
