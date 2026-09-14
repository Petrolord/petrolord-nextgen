# Three outcomes and four actions

The engine's lottery form takes a list of outcomes with their probabilities and a list of actions, each with a cost and one payoff per outcome. Three outcomes and four actions roll back exactly as two outcomes do: one weighting line per action and a maximum across them.

{{panel:ec-judgement-explorer}}

## The published lottery

| action | cost | Large 0.200000 | Medium 0.500000 | Dry 0.300000 | value at the prior |
| --- | --- | --- | --- | --- | --- |
| Drill alone | 60.0000 | 500.0000 | 150.0000 | -20.0000 | 109.0000 |
| Drill with partner | 30.0000 | 250.0000 | 75.0000 | -10.0000 | 54.5000 |
| Farm out | 0.0000 | 80.0000 | 30.0000 | 0.0000 | 31.0000 |
| Relinquish | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |

## Rolling it back by hand

Drill alone: 0.200000 x 500.0000 + 0.500000 x 150.0000 + 0.300000 x -20.0000, less the cost 60.0000, is 109.0000.

Drill with partner: 0.200000 x 250.0000 + 0.500000 x 75.0000 + 0.300000 x -10.0000, less 30.0000, is 54.5000.

Farm out: 0.200000 x 80.0000 + 0.500000 x 30.0000 + 0.300000 x 0.0000 is 31.0000.

The maximum is 109.0000, so emvPrior is 109.0000 with Drill alone. The cost here belongs to the action and is paid in every outcome, so weighting first and subtracting once is right. On a chance node whose branches carry different costs it is not: the published chanceRootWithBranchCosts tree is worth -3.0000, and subtracting every cost once after weighting gives a wrong -8.6000.

## Perfect information with four actions

With the outcome known first, the published golden records the best action for Large, Medium and Dry as indices 0, 0 and 2: Drill alone, Drill alone, Farm out. That gives evWithPerfect 133.0000 and an EVPI of 24.0000.

The Dry column hides a tie. Drill alone pays -20.0000 there before its 60.0000 cost, the partner -10.0000 before 30.0000, and Farm out and Relinquish both pay 0.0000 at no cost. Farm out is recorded because it is listed before Relinquish and the comparison is strictly greater. Listed the other way round the golden would name Relinquish, and evWithPerfect would not move.

Only Dry changes the action away from Drill alone, so perfect information is worth what it saves in the 0.300000 of cases that come up dry.

## What the Analyzer cannot take

The VOI Analyzer offers exactly two actions, the named decision at its cost and "Do Not" with every payoff 0. This lottery would lose Drill with partner and Farm out on the way in. On EKPAN a missing farm-out cut the survey's gross value from 24.8250 to 19.8375, and the Analyzer's card of 19.84 is that two-action number. A lottery with more than one real alternative belongs in the engine's lottery form, or drawn as a tree in the Decision Tree Builder.

## The mistake

The careful mistake is to read the perfect information indices as a recommendation. They say what would be done with the outcome known in advance. Without that knowledge the engine recommends Drill alone at 109.0000, and that choice still pays -20.0000 less its 60.0000 cost whenever the well is dry. The second mistake is to read "Farm out" in the Dry column as a preference over Relinquish, when it is only the branch listed first.

## Exercise

Roll back all four actions by hand and give emvPrior. Then state evWithPerfect and the EVPI, name the best action for each outcome, and explain why the Dry outcome records Farm out.
