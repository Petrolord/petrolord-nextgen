# A fitting is a resistance

A fitting has no length in this module. It has a K, a multiplier on one velocity head, and that dimensionless number is the whole of what the table knows about it.

{{panel:pd-trunk-explorer}}

## The published coefficients

| Fitting id | K |
| --- | --- |
| ballValve | 0.05 |
| gateValve | 0.15 |
| teeLine | 0.2 |
| elbow90LR | 0.3 |
| elbow45 | 0.35 |
| elbow90Std | 0.75 |
| teeBranch | 1 |
| suddenExit | 1 |
| swingCheck | 2 |
| globeValve | 10 |

Ten entries, and they are round on purpose. The module header says they are approximations to begin with, they vary between manufacturers, and quoting them to three decimals would suggest a precision that does not exist.

## What K counts

The loss is K velocity heads, in the Crane TP-410 sense, so K is a pure number that knows nothing about the bore, the fluid or the rate. A long radius 90 degree elbow is 0.3 and a standard 90 degree elbow on the same turn is 0.75, and the difference is the radius alone. A tee taken straight through is 0.2 and the same tee taken on the branch is 1. An exit into a vessel is 1, and it counts even though nothing is bolted there, because the velocity head leaving the pipe is lost the same way.

## Fully open, and nothing else

Every valve label ends in the words fully open: gate valve at 0.15, ball valve at 0.05, globe valve at 10. There is no entry for a valve in any other position, so a throttling valve is not in this module and cannot be reached by scaling one of these. The module also ships absolute roughnesses, 0.0018 in for new commercial steel, 0.006 in for steel in service, 0.0002 in for internally coated and 0.00006 in for HDPE, and the equivalent length calculation never touches them. It asks for a friction factor, and nothing in the file iterates toward one.

## What it refuses

An unknown id resolves to NaN and never to a default: `fittingK('elbow90')` is NaN. That id is the trap, because elbow90 is exactly what a careful person types when the table holds elbow90LR and elbow90Std. A fitting list carrying an id the table does not have refuses whole rather than dropping the term: `ok = false`, with the message naming it, No resistance coefficient for reducer.

## The mistake

Counting fittings rather than adding K. Four long radius elbows and two gate valves are six items and a sum K of 1.500000. One globe valve is one item and a K of 10. The count is what an engineer can see on a drawing, and it is not what anything costs.

## Exercise

In the panel, add the K of four long radius elbows and two gate valves, and write the sum.

Then say what the same list sums to with the two gate valves changed for globe valves, and why that answer needs no bore.
