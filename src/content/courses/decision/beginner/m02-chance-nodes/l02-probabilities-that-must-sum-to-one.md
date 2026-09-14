# Probabilities that must sum to one

A chance node's probabilities must add to 1 within 1e-6, or the engine refuses the whole tree. It checks the sum and reports it. It never rescales.

{{panel:ec-tree-explorer}}

## The EKPAN tree passes

Success at 0.350000, Marginal at 0.150000 and Dry hole at 0.500000 add to exactly 1. The farm-out node carries the same three probabilities and passes too. The branches of a chance node are meant to be exhaustive and exclusive: one of them happens, and only one, so their chances must account for the whole.

## Thirds, typed at different precision

A chance node with three equal outcomes paying 30, 60 and 90 is worth 60.0000 when it is accepted. How the thirds are typed decides whether it is:

| each probability | sum | result |
| --- | --- | --- |
| 0.3333333333 | 1.000000 | accepted, emv 60.0000 |
| 0.3333333 | 1.000000 | accepted, emv 60.0000 |
| 0.333333 | 0.999999 | refused |
| 0.33333 | 0.999990 | refused |
| 0.3333 | 0.999900 | refused |
| 0.333 | 0.999000 | refused |

Seven decimals pass. Six decimals, which looks precise, is refused with `Chance branch probabilities sum to 0.999999, expected 1 (at node "Three equal outcomes")`. The printed sum sits right at the edge of the tolerance and the engine does not accept it, so a sum at the edge is never safe to rely on. The published thirdsProbabilities case rolls back to 35.0000, matching its golden 35.0000.

## Sums that are not close

Further from 1 the message is the same shape. A node summing to 0.9 is refused with `Chance branch probabilities sum to 0.900000, expected 1 (at node "bad")`, and one summing to 1.2 with `Chance branch probabilities sum to 1.200000, expected 1 (at node "bad")`. A single branch outside the range is caught before any sum: a branch at 1.5 reads `Branch "a" needs a probability between 0 and 1 (at node "bad")`. The check runs at every chance node however deep, and a bad node two levels below the root is named: `Chance branch probabilities sum to 0.200000, expected 1 (at node "cc")`.

## What the check does and does not say

A refusal returns no EMV for any part of the tree, including the parts that were well formed. An acceptance says only that the numbers add up. Any set of probabilities that sums to 1 within 1e-6 passes, whether or not it describes the prospect, and the engine has no way to test the difference.

## The mistake

The careful mistake is repairing a refused sum in the wrong place. A reader refused at 0.999000 who adds the whole shortfall to the last branch gets an accepted tree whose last outcome now carries more weight than the other two, although they were meant to be equal. The fix is to type every branch at enough precision, or to derive the last branch as 1 less the others, knowing what that does to its weight. The opposite mistake is leaving an outcome off the tree and expecting the engine to spread its probability over the rest. It does not: the sum falls short and the tree is refused.

## Exercise

For each typed third, say whether the engine accepts it and what sum it prints. Write the refusal for a node summing to 1.2 and for a branch typed at 1.5. Then say what the engine returns for the rest of a tree when one chance node two levels down fails the check.
