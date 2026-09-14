# A missing third action

The Analyzer weighs one action against doing nothing. Typed with the EKPAN lottery, whose best move after a disappointing survey is to farm out, it gives a gross value of information of 19.84, where the full lottery values the same survey at 24.8250.

{{panel:ec-information-explorer}}

## Same prior value, same EVPI

| quantity | Drill, Farm out, Walk away | Drill or Walk away |
| --- | --- | --- |
| emvPrior | 75.7500 | 75.7500 |
| evWithInfo | 100.5750 | 95.5875 |
| evii | 24.8250 | 19.8375 |
| evpi | 52.0000 | 52.0000 |

The Analyzer's numbers on the EKPAN lottery are the two-action column rounded: voi 19.84, net VOI 11.84 and EVPI 52.00.

Two rows agree, which makes the gap easy to miss. At the prior, Drill at 75.7500 already beats Farm out at 33.2500, so removing the farm-out removes a branch nobody chose. Under perfect information a known success chooses Drill at 365.0000 and a known dry hole chooses an action worth 0.0000, which Farm out and Walk away both pay. The farm-out adds nothing there either.

## Where the gap comes from

The farm-out matters only after a reading that makes Drill a poor bet. After no bright spot the success posterior is 0.097222, and the three actions are worth Drill -36.7361, Farm out 9.2361 and Walk away 0.0000. After a bright spot Drill wins at 207.7989 either way. Weighting by the chance of each reading:

- with the farm-out: 0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750
- without it: 0.460000 x 207.7989 + 0.540000 x 0.0000 = 95.5875

The whole difference between 24.8250 and 19.8375 is 0.540000 x 9.2361: the dropped action's value, weighted by the chance of the reading that would use it.

## What it does to a price

At a survey cost of 20.0000 the three-action information tree still acquires, with a net value of 4.8250. The two-action gross value, 19.8375, is less than that cost, so the Analyzer's net value is negative and its verdict says acquiring the survey is not justified on EMV grounds.

The error has no fixed direction. Here the missing action is one the information would choose, and the Analyzer understates. If the missing action were the best one at the prior, the EMV without information would be wrong as well, and the value could err either way.

## What it refuses

The Analyzer cannot carry a third action. "Do Not" pays 0 in every outcome, and there is no box for a farm-out beside the drill. A decision with three live choices belongs in the tree engine's information tree, which keeps every action after every reading: on the EKPAN lottery its root is 92.5750 for acquiring at a cost of 8.0000, against 75.7500 for no further information.

## The mistake

The careful mistake is taking the matching rows as proof the typing captured the decision. The Analyzer's 75.75 and 52.00 match the lottery's 75.7500 and 52.0000 exactly, and a reviewer who checks those two and stops passes a survey value short by the farm-out. Only the value with information exposes the missing action.

## Exercise

Write the value with information for the EKPAN lottery with and without the farm-out, and state the weighted term that separates them. Then explain why emvPrior and EVPI do not change when the farm-out is removed, and say what each tool concludes at a survey cost of 20.0000.
