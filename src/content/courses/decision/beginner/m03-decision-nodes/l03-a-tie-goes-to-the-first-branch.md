# A tie goes to the first branch

When two branches of a decision node are exactly equal, the engine keeps the one listed first. The EMV is the same whichever is named, and the recommendation depends on how the tree was typed.

{{panel:ec-tree-explorer}}

## Strictly greater

The engine walks a decision node's branches in order and replaces the current best only when a later branch is strictly greater. An equal branch never displaces an earlier one. On the published equalEmvTie case:

| branch | branchValue |
| --- | --- |
| A | 30.0000 |
| B | 30.0000 |
| C | 29.9990 |

The engine returns EMV 30.0000 with best branch index 0, A, and the golden agrees at 30.0000. C is not tied at all.

## The same tie, listed the other way

Drill pays 40.0000 at a cost of 10.0000, a branch value of 30.0000, and Farm out pays 30.0000. Listed Drill first, the engine recommends Drill. Listed Farm out first, it recommends Farm out. Both trees roll back to EMV 30.0000. Nothing about the prospect changed, and the recommended first move did.

## A tie on a swept tree

The published drillFarmOut tree, with its success probability swept, ties exactly at a success probability of 0.200000: Drill 12.0000, Farm out 12.0000, Do nothing 0.0000. The engine reports Drill, the first branch listed. At 0.150000 Farm out leads 9.0000 to -3.5000, and at 0.250000 Drill leads 27.5000 to 15.0000, so the tie sits between two clear answers.

## A near tie that is not a tie

The EKPAN lottery, a two-outcome model distinct from the EKPAN tree, has drill and farm-out values that cross at a success probability of 0.228571. At that probability the engine reads Drill 21.7143 and Farm out 21.7143 and names Farm out, the second branch. The tie rule did not pick it. The crossing has no exact binary image, the two values differ in their last binary digits, and Farm out is larger by that residue. Four decimals print a tie the engine never saw.

## What the Builder shows

In a tie the Decision Tree Builder's Recommended first move card names the first branch, and on equalEmvTie the Decision advantage is 0.0000. A card reading Drill beside an advantage of 0 recommends nothing: the two moves are worth the same.

## The mistake

The careful mistake is reporting the first move of a tied tree as the tree's recommendation. The name comes from the order of typing, and a colleague who lists the branches differently gets the other move from the same numbers. The second mistake is trusting printed equality in either direction: two values printed as 21.7143 can be unequal, and the engine will choose between them without any tie involved.

## Exercise

Roll back the Drill and Farm out pair in both listing orders and state the EMV and recommendation each time. Explain why equalEmvTie returns A rather than B or C. Then say why the EKPAN lottery at 0.228571 names Farm out, and why that is not the tie rule at work.
