# A tie is reported, and the first branch is marked

When two branches of a decision node are worth the same, the engine says so, and marks the first one listed on the optimal path. The mark carries no advice.

{{panel:ec-tree-explorer}}

## A tie band

Two branch values tie when they differ by at most 1e-9 x max(1, |best|). A decision node returns tiedIndices, every branch that ties with the best in listed order, and indifferent, true when more than one branch ties. bestBranchIndex marks the first of them. A second pair, tiedIndicesAtCardPrecision and indifferentAtCardPrecision, holds every branch whose value rounds to the same two-decimal card as the best. On the published equalEmvTie case:

| branch | branchValue |
| --- | --- |
| A | 30.0000 |
| B | 30.0000 |
| C | 29.9990 |

The engine returns EMV 30.0000, tiedIndices [0, 1] and indifferent true, and the golden agrees at 30.0000. On value only A and B tie. On the two-decimal cards A, B and C all read 30.00, so the card set is [0, 1, 2] and indifferentAtCardPrecision is true. A is marked because it is listed first.

## The same tie, listed the other way

Drill pays 40.0000 at a cost of 10.0000, a branch value of 30.0000, and Farm out pays 30.0000. Listed Drill first, the engine reports tiedIndices [0, 1], indifferent true, and the optimal path marks Drill. Listed Farm out first, it reports the same tie and marks Farm out. Both trees roll back to EMV 30.0000. Only the mark moved.

## A tie on a swept tree

The published drillFarmOut tree, with its success probability swept, ties exactly at a success probability of 0.200000: Drill 12.0000, Farm out 12.0000, Do nothing 0.0000. The engine reports tiedIndices [0, 1], indifferent true, and marks Drill, the first listed. At 0.150000 and 0.250000 there is a clear answer either side.

## A tie inside the band

The EKPAN lottery, a two-outcome model distinct from the EKPAN tree, has drill and farm-out values that cross at a success probability of 0.228571. At that probability the engine reads Drill 21.7143 and Farm out 21.7143. Drill less Farm out is -7.11e-15, because the crossing has no exact binary image. That residue is far inside the tie band, and the engine reports the two tied with Drill carrying the actionIndex. Four decimals print a tie, and the engine reports one too.

## What the Builder shows

When the root branches tie at card precision, the Decision Tree Builder's Recommended first move card reads "Indifferent:" followed by every tied branch and "come to the same figure", and the Decision advantage card reads Indifferent.

## The mistake

The careful mistake is reporting the marked branch of a tied tree as the tree's recommendation. The mark comes from the order of typing, and a colleague who lists the branches differently gets the other mark from the same numbers. The second mistake is trusting printed figures: two values printed alike may still differ, and only the tie fields say whether the engine calls them tied.

## Exercise

Roll back the Drill and Farm out pair in both listing orders and state the EMV, the tie fields and the marked branch each time. Explain why equalEmvTie reports A and B tied on value and A, B and C at card precision. Then say why the engine reports Drill and Farm out tied at 0.228571 although they differ by -7.11e-15.
