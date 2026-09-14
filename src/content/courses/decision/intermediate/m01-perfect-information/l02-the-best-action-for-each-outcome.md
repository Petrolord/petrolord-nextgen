# The best action for each outcome

Perfect information is valued by choosing, for each outcome, the action that pays most in that outcome, and only then weighting those best values by the prior. The maximum is taken outcome by outcome, never once for the whole lottery.

{{panel:ec-information-explorer}}

## The table

| outcome | prior | Drill net | Farm out net | Walk away net | best action if known | best value |
| --- | --- | --- | --- | --- | --- | --- |
| Success | 0.350000 | 365.0000 | 95.0000 | 0.0000 | Drill | 365.0000 |
| Dry hole | 0.650000 | -80.0000 | 0.0000 | 0.0000 | Farm out | 0.0000 |

Read each outcome on its own. On Success, Drill's 365.0000 beats Farm out's 95.0000 and Walk away's 0.0000. On Dry hole, Drill loses 80.0000 while Farm out and Walk away both pay 0.0000.

## Net of the cost

The Drill column is net of its 55.0000 cost: 420.0000 less 55.0000 is 365.0000, and -25.0000 less 55.0000 is -80.0000. The cost sits inside each outcome because it is paid whichever outcome arrives. A reader who works from the gross payoffs still picks Drill on Success, but carries 420.0000 into the weighting as its best value, and on Dry hole weighs -25.0000 against 0.0000 when the honest comparison is -80.0000 against 0.0000. The action survives the error and the value does not.

## A tie on the dry hole

On Dry hole, Farm out and Walk away pay exactly the same, 0.0000. The engine keeps the first branch listed when a later branch is only equal, so it reports Farm out. The best value is 0.0000 whichever is named, so evWithPerfect does not depend on the label, but the label does depend on the listing. List Walk away first and the report names Walk away with the same number beside it. On a tied outcome, read the best value and treat the name as the listing order speaking.

## Weighting the best values

0.350000 x 365.0000 + 0.650000 x 0.0000 = 127.7500

Only the best value in each outcome enters. Farm out's 95.0000 on Success and Drill's -80.0000 on Dry hole carry no weight at all: nobody told in advance of a success would farm out, and nobody told of a dry hole would drill.

## The published cases

The goldens use the same construction. The published prospect gives evWithPerfect 78.0000 against an emvPrior of 43.0000, and voiDefaultLottery gives 78.0000 against 15.0000. On threeOutcomesFourActions, with outcomes Large, Medium and Dry, the golden best action if known is Drill alone on Large and on Medium and Farm out on Dry, where Farm out and Relinquish both pay 0.0000 and the first listed is kept again. Its evWithPerfect is 133.0000.

## The mistake

The order of the two operations is the whole method, and swapping it is the error a careful person makes. Weight each action's column by the priors first and take the largest, and the answer is Drill at 75.7500: that is emvPrior, the value without information. Take the largest value in each outcome first and weight second, and the answer is 127.7500. The same six numbers give both results, so a reader who does not say which order was used cannot be checked.

## Exercise

Copy the table for EKPAN at a success probability of 0.350000. Mark the best value in each outcome, name the action the engine reports for Dry hole and say why it is that one, then weight the marked values to reach evWithPerfect. Finally show that taking the maximum after weighting gives 75.7500.
