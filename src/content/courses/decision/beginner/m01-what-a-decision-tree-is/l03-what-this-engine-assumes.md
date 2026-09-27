# What this engine assumes

The EKPAN tree rolls back to 105.0000 million USD only under assumptions nobody types in: risk neutrality, money that is already discounted, a tie that is reported with the first listed branch marked, and probabilities that sum to 1 within 1e-6 (inclusive, with a 1e-12 allowance for binary representation).

## Risk neutral

The rollback maximises expected money. Neither the tree engine nor the VOI Analyzer has a utility function or a risk aversion parameter. On the EKPAN tree the drill branch is worth 105.0000 against the farm-out's 37.7500, and the drill loses money with probability 0.500000 while the farm-out never loses. A company unwilling to risk an even chance of losing 80.0000 million USD has a preference this tree lacks.

## No discounting

The engine has no rate and no dates. The EKPAN tree's success payoff of 420.0000 and its dry hole of -25.0000 enter the rollback exactly as typed, and so does the drill cost of 55.0000. They must already share one date.

## Ties are reported

Two branch values tie when they differ by at most 1e-9 x max(1, |best|). A decision node then returns tiedIndices, every branch that ties with the best, and indifferent true; bestBranchIndex only marks the first listed of them. A second pair, at card precision, holds every branch that rounds to the same two-decimal card. On the published equalEmvTie case A and B are both worth 30.0000 and C is worth 29.9990: EMV 30.0000, tiedIndices [0, 1], and the card set [0, 1, 2], because all three print as 30.00. A is marked only because it is listed first.

## Probabilities checked and left as typed

A chance node is accepted when |sum - 1| is at most 1e-6 plus a 1e-12 allowance for binary representation. Outside that band it refuses, and the published messages read, verbatim:

- a sum of 0.9: `Chance branch probabilities sum to 0.900000, expected 1 (at node "bad")`
- a sum of 1.2: `Chance branch probabilities sum to 1.200000, expected 1 (at node "bad")`
- one branch at 1.5: `Branch "a" needs a probability between 0 and 1 (at node "bad")`
- a bad node two levels down: `Chance branch probabilities sum to 0.200000, expected 1 (at node "cc")`

The check names the node that failed. A refusal returns no EMV at all, and a sum of 0.9 is never rescaled.

## The mistake

The careful mistake is reading a clean rollback as a validated one. The engine cannot tell whether a payoff is really discounted, whether probabilities that sum to 1 are the right ones, or whether a branch left off the tree, a walk-away or a partner, would have beaten every branch drawn. A tree with undiscounted payoffs and a success probability chosen to flatter the drill passes every check it makes: known node types, at least one branch per node, probability sums within tolerance, and money that is a finite number with costs of 0 or more. No error means well formed, and says nothing about whether the numbers are true.

## Exercise

List the four assumptions behind the EKPAN tree's 105.0000. For each refusal message, say what was typed to produce it. Then say which assumption means the drill would still be recommended if its dry hole lost far more while its EMV stayed at 105.0000.
