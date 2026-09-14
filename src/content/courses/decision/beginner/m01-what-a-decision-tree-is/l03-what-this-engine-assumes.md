# What this engine assumes

The EKPAN tree rolls back to 105.0000 million USD only under assumptions nobody types in: risk neutrality, money that is already discounted, a first listed branch that keeps a tie, and probabilities that sum to 1 within 1e-6.

## Risk neutral

The rollback maximises expected money. There is no utility function and no risk aversion parameter in the tree engine or in the VOI Analyzer. On the EKPAN tree the drill branch is worth 105.0000 against the farm-out's 37.7500, and the drill loses money with probability 0.500000 while the farm-out never loses. Nothing in the engine can be set to prefer the farm-out for its safety. A company that will not accept an even chance of losing 80.0000 million USD holds a preference this tree does not.

## No discounting

The engine has no rate and no dates. The EKPAN tree's success payoff of 420.0000 and its dry hole of -25.0000 enter the rollback exactly as typed, and so does the drill cost of 55.0000. The tree adds them at face value, so whatever valued them must already have put them on one date.

## Ties keep the first branch

At a decision node a later branch replaces the current best only when it is strictly greater. On the published equalEmvTie case branches A and B are both worth 30.0000 and C is worth 29.9990. The engine returns EMV 30.0000 with best branch index 0, A. Listed with B first, the same numbers recommend B. In a tie the recommendation records the order of listing and nothing about the branches.

## Probabilities checked, never repaired

A chance node is accepted when its probabilities sum to within 1e-6 of 1. Outside that band it refuses, and the published messages read, verbatim:

- a sum of 0.9: `Chance branch probabilities sum to 0.900000, expected 1 (at node "bad")`
- a sum of 1.2: `Chance branch probabilities sum to 1.200000, expected 1 (at node "bad")`
- one branch at 1.5: `Branch "a" needs a probability between 0 and 1 (at node "bad")`
- a bad node two levels down: `Chance branch probabilities sum to 0.200000, expected 1 (at node "cc")`

The check reaches every node however deep and names the one that failed. It never rescales a sum of 0.9 up to 1, and a refusal returns no EMV at all.

## The mistake

The careful mistake is reading a clean rollback as a validated one. The engine cannot tell whether a payoff is really discounted, whether probabilities that sum to 1 are the right ones, or whether a branch left off the tree, a walk-away or a partner, would have beaten every branch drawn. A tree with undiscounted payoffs, a success probability chosen to flatter the drill and conveniently ordered branches passes every check it makes: known node types, at least one branch per node and probability sums within tolerance. The absence of an error says the tree is well formed and nothing about whether its numbers are true.

## Exercise

List the four assumptions behind the EKPAN tree's 105.0000. For each refusal message, say what was typed to produce it. Then say which assumption means the drill would still be recommended if its dry hole lost far more while its EMV stayed at 105.0000.
