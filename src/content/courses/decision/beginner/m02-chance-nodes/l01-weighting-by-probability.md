# Weighting by probability

A chance node is worth the sum of each branch value times its probability. On the EKPAN tree that turns three drill outcomes into 160.0000 million USD and three farm-out outcomes into 37.7500.

{{panel:ec-tree-explorer}}

## The drill chance node by hand

| branch | probability | branchValue |
| --- | --- | --- |
| Success | 0.350000 | 420.0000 |
| Marginal | 0.150000 | 170.0000 |
| Dry hole | 0.500000 | -25.0000 |

0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000

Each term is one outcome's contribution. The dry hole's term is negative and still counts at half the weight: nothing is left out because it is unwelcome. The drill cost of 55.0000 sits on the branch leading into this node, so the Drill branch is worth 160.0000 less 55.0000, which is 105.0000.

## The farm-out chance node

0.350000 x 95.0000 + 0.150000 x 30.0000 + 0.500000 x 0.0000 = 37.7500

The dry hole contributes nothing here because the farm-out pays 0.0000 in a dry hole. The two nodes share the same three probabilities and weight different payoffs, which is the whole reason they differ.

## A decision inside the weighting

The Marginal branch does not end in a terminal. It leads to "Marginal find", a decision between Develop, a payoff of 260.0000 less a cost of 90.0000, worth 170.0000, and Sell, worth 140.0000. The chance node weights 170.0000, the value of that later decision, because the owner will take the better branch if a marginal find occurs. A chance node weights branch values, whatever sits beneath them: a payoff, another chance node or a choice.

## What weighting assumes

The weighted sum is an average over outcomes the owner cannot control. It treats a million USD lost in a dry hole and a million USD gained in a success as exactly offsetting, which is the risk neutral assumption. It uses the probabilities as typed and has no view of how they were estimated. Nor does it know that the Marginal branch hides a choice: it receives the 170.0000 that choice is worth and weights it like a payoff. It weights only what is drawn as a branch: an outcome left off the tree has no weight at all, and the remaining probabilities must still sum to 1.

## The mistake

Two careful errors each give a plausible drill node that is not 160.0000. The first weights the marginal find at 260.0000, the develop payoff before its 90.0000 cost, as if development were free. The second weights it at 140.0000, the sale, forgetting that the owner would choose to develop. Both come from reading a payoff where the node needs a branch value, and both leave the probabilities untouched, so the engine has nothing to refuse and the wrong EMV comes back looking exactly like a right one. A third error reads the node's 160.0000 as the value of drilling and forgets the 55.0000 still to be paid on the branch.

## Exercise

Write both weighting lines for the EKPAN tree and check them against 160.0000 and 37.7500. Explain why the Marginal branch enters at 170.0000 rather than at 260.0000 or 140.0000, and say where the drill cost of 55.0000 is subtracted and what the Drill branch is worth once it is.
