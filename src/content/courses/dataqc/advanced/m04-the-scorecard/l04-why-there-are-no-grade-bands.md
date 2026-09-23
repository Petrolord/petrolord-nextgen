# Why there are no grade bands

{{panel:dq-monitor-explorer}}

The engine's scorecard returns a total, the weakest dimension, a row for each dimension and a basis block, and no grade. It does not say that 0.927390 is good, or that 0.889531 is fair, or that either passes. On EKENE-3 those two totals come from the same five scores under two weightings, and both name uniqueness as the weakest dimension at 0.538462. A grade band would have to put a line somewhere between them or around them, and the engine has no number to put there.

| what the scorecard returns | EKENE-3, stated weights | EKENE-3, equal weights |
| --- | --- | --- |
| total | 0.927390 | 0.889531 |
| weakest dimension | uniqueness | uniqueness |
| a grade | none | none |

## A band would be an invented number

A band such as "above some value is acceptable" is a claim about what the data are for. A daily production report might tolerate a duplicated well name that a reserves database cannot. The engine has no published source for any such line, and it declines to invent one. Its list of what it does not build includes grade bands for a scorecard, and in their place it returns a total and the weakest dimension.

## The weights move the total

A band would also sit on a total that the caller's own weights move. The same EKENE-3 scores read 0.889531 with equal weights and 0.927390 with the stated weights 3, 2, 2, 1 and 1. A fixed band applied to both would grade the same data differently depending on a weighting choice, and it would give the weighting a power over the verdict that nobody set out to give it.

## What a plan does instead

A plan that needs a decision writes its own rule, in its own words, with its reason: for example, that any dimension below a stated score stops the data going further until it is investigated. That rule is the plan's, and it is written beside the weights so a reader can see both. The engine's contribution is the evidence the rule is applied to: five scores, their counts, their weights, the total and the weakest.

## Reading a scorecard honestly

The scorecard compresses a set of checks into a few numbers, and every compression loses something. The total loses which dimension was weak. The weakest dimension loses how weak the others were. The scores lose which entries failed, and that two checks can flag the same entry, as day 47 is flagged under validity and plausibility on EKENE-3. A quality note reports the scorecard with its weights and its counts, and it lists the flags beneath, so that a reader can go from the summary back to the rows.

## Exercise

In the panel's scorecard view, load EKENE-3's five rows with the stated weights. Write a one-line decision rule of your own for this data, naming the use it serves and the threshold you chose, and apply it. Then switch to equal weights and apply the same rule. Say in two sentences whether your rule gave the same answer both times, and why a rule based on the weakest score behaves differently under reweighting from a rule based on the total.
