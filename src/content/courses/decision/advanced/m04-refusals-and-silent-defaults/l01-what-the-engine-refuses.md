# What the engine refuses

The rollback engine answers a tree it cannot roll back with a message and no number. Each message is exact, and most name the node at fault.

{{panel:ec-judgement-explorer}}

## The rollback refusals

The published rollbackRefusals cases, each with the engine's message verbatim:

| what was typed | message |
| --- | --- |
| a chance node summing to 0.9 | `Chance branch probabilities sum to 0.900000, expected 1 (at node "bad")` |
| a chance node summing to 1.2 | `Chance branch probabilities sum to 1.200000, expected 1 (at node "bad")` |
| one branch at probability 1.5 | `Branch "a" needs a probability between 0 and 1 (at node "bad")` |
| a decision node with no branches | `Decision and chance nodes need at least one branch (at node "empty")` |
| a node of type "lottery" | `Unknown node type "lottery" (at node "x")` |
| a branch with no child node | `Missing node` |
| a bad distribution two levels down | `Chance branch probabilities sum to 0.200000, expected 1 (at node "cc")` |
| a branch cost left blank | `Branch "Drill" has a blank cost; a cost must be a number of 0 or more (at node "Prospect decision")` |
| a branch cost "abc" | `Branch "Drill" has a cost that is not a finite number ("abc"); a cost must be a number of 0 or more (at node "Prospect decision")` |
| a branch cost of -5 | `Branch "Drill" has a negative cost (-5); a cost cannot be negative: enter a receipt as a payoff (at node "Prospect decision")` |
| a terminal payoff left blank | `Terminal payoff is blank; a payoff must be a finite number (at node "Success")` |
| a terminal payoff true | `Terminal payoff is not a finite number (true); a payoff must be a finite number (at node "Success")` |

The sum is printed to six decimals, and that precision is diagnostic. A sum of 0.900000 is a branch left out or a digit mistyped. A sum of 0.999999 is rounding, and it is accepted: a chance node passes when |sum - 1| is at most 1e-6 plus a 1e-12 allowance for binary representation, inclusive. Three equal outcomes paying 30, 60 and 90 typed as 0.3333333 each sum to 1.000000 and roll back to 60.0000; typed as 0.333333 each they are accepted at 59.9999, used as typed; typed as 0.333 each they return `Chance branch probabilities sum to 0.999000, expected 1 (at node "Three equal outcomes")`.

## One bad node stops the whole tree

The last case is the one that matters in a large tree. The fault sits two levels under the root, at node "cc", and the engine returns the message and nothing else: no root EMV, no best branch, no value for the healthy branches. The node label in the message is the only pointer to where the fault lives. A probability outside 0 to 1 is caught branch by branch, so 1.5 comes back with its branch named, "a", as well as its node.

## The information refusals

The Bayes calculation behind EVII checks its own inputs (published eviiRefusals):

- a likelihood column for Success summing to 0.9: `Likelihoods P(signal | "Success") sum to 0.900000, expected 1`
- a likelihood column for Dry hole summing to 1.2: `Likelihoods P(signal | "Dry hole") sum to 1.200000, expected 1`
- priors summing to 0.9: `Outcome probabilities sum to 0.900000, expected 1`
- no signals: `No signals given`
- an action with too few payoffs: `Action "short" needs one payoff per outcome`

Likelihoods are checked down each outcome's column, across the signals. EKPAN's survey passes because Success reads 0.850000 for a bright spot and 0.150000 for none. A distribution payoff with no mean is refused too, with `Distribution payoff has no finite mean (at node "Success")` on EKPAN's success terminal.

## The mistake

The careful mistake is reading a returned number as proof that the tree passed every check. The refusals cover sums, ranges, structure, missing means and money that is present but not a finite number of the right sign. On a branch paying 20, a cost of 5 gives a value of 15.0000; the same cost typed as "abc" is refused with `Branch "A" has a cost that is not a finite number ("abc"); a cost must be a number of 0 or more (at node "d")`. A cost left out is accepted as 0 and the branch reads 20.0000, with no message. The cases to hunt are the ones it accepts.

## Exercise

Write the message the engine returns for three thirds typed as 0.333 on node "Three equal outcomes", for a branch "a" at probability 1.5 on node "bad", and for a Dry hole likelihood column summing to 1.200000. Then explain why a fault at node "cc" leaves no EMV for any part of the tree.
