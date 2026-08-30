# Three cases, three limits

There is no design case, and the reason is that the limits are not ordered.

{{panel:ct-tubing-explorer}}

## The table

| case | total force (N) | packer SF | length (m) | stroke | buckling |
|---|---|---|---|---|---|
| production heating | -123684.94705447978 | 5.416989018921467 | 0.8947604591459051 | ok | helical |
| injection cooling | 250266.9927748846 | 2.6771408908991274 | -1.81047908170819 | exceeded | none |
| stimulation | 462406.42264968524 | 1.448941812184961 | -3.3451361131262445 | exceeded | none |

## Read it three ways

**By packer force,** stimulation is worst and production heating is best, by a factor of nearly four.

**By stroke,** stimulation is worst, injection cooling is second, and production heating passes.

**By buckling,** production heating is the ONLY case that buckles, and it is the case with the best packer safety factor of the three.

## The finding

The case that buckles is the case that is safest on the packer. The case that is worst on the packer does not buckle at all.

So the question "which is the design case" has no answer. It has three answers, and which one you get depends on which limit you asked about.

## Why the ordering breaks

Because buckling responds to the SIGN of the force and the other two respond to its MAGNITUDE.

The packer safety factor uses the absolute total. The stroke uses the absolute length. Buckling uses max(0, minus total), which is zero unless the string is in compression.

Only one of the three published cases is in compression, and compression is the one thing the other two limits are indifferent to.

## What a designer does with that

Runs all of them, and does not shortcut.

The temptation on a completion is to identify the severest operation, size for it and move on. On this completion that would mean sizing for stimulation, which would tell you nothing about buckling, because stimulation does not buckle and never will: it is a cooling event.

## The general rule

Whenever the limits in a problem respond to different FUNCTIONS of the same variable, an absolute value here and a one-sided maximum there, the worst case for one is not the worst case for another and there is no single governing scenario.

That is exactly the shape of the Professional tier's result, where the case named after burst was governed by triaxial. Same mechanism, different module.

## Exercise

Construct a fourth case that is worse than all three of these on ALL of the limits at once.

Say what temperature change and what pressure changes it needs, and then say whether a real well would ever do it.
