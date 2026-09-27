# A cost that is not a number is refused

The rollback engine reads money strictly. A cost or a payoff that is present must be a finite number, or text holding one, and a cost cannot be negative; anything else is refused with a message naming the node. Only money that is left out altogether reads as 0, and that case is silent.

{{panel:ec-judgement-explorer}}

## One decision, eleven inputs

Branch A pays 20 at the cost shown, and branch B pays 12 at no cost. The correct reading is a cost of 5: A is worth 20 less 5, which is 15.0000, and A beats B.

| what was typed on A | result |
| --- | --- |
| cost 5 | accepted, emv 15.0000, best A, branch A 15.0000 |
| cost "5" as text | accepted, emv 15.0000, best A, branch A 15.0000 |
| cost "abc" | refused: `Branch "A" has a cost that is not a finite number ("abc"); a cost must be a number of 0 or more (at node "d")` |
| cost left empty "" | refused: `Branch "A" has a blank cost; a cost must be a number of 0 or more (at node "d")` |
| cost absent | accepted, emv 20.0000, best A, branch A 20.0000 |
| cost -5 | refused: `Branch "A" has a negative cost (-5); a cost cannot be negative: enter a receipt as a payoff (at node "d")` |
| payoff "20" as text | accepted, emv 15.0000, best A, branch A 15.0000 |
| payoff "" | refused: `Terminal payoff is blank; a payoff must be a finite number (at node "A")` |
| payoff null | refused: `Terminal payoff is blank; a payoff must be a finite number (at node "A")` |
| payoff "20abc" | refused: `Terminal payoff is not a finite number ("20abc"); a payoff must be a finite number (at node "A")` |
| payoff with p50 20 and no mean | refused: `Distribution payoff has no finite mean (at node "A")` |

## A cost left out is zero

Text that reads as a number is converted, so "5" behaves like 5. A cost typed as "abc" or left as an empty entry is refused by node label, and so is a negative cost: a receipt belongs in a payoff. The one case the engine accepts without a word is a cost that is not there at all. It is charged as 0, branch A reads 20.0000, and the root EMV rises by the cost that went missing, from 15.0000 to 20.0000, with nothing in the output to say so.

The published omittedCostAndPayoffAreZero case shows the rule in a tree: a cost and a payoff left out read as 0, giving branch values "A" 0.0000 and "B" 3.0000, emv 3.0000, best B.

## Payoffs are read the same way

A payoff that is blank, null, text that is not a number or true or false is refused, and a distribution summary without a finite mean is refused. A payoff left out is read as 0, like a cost, and a missing payoff is the more dangerous of the two, because it can move the recommendation as well as the value.

## The Builder removes the entry

In the Decision Tree Builder, clearing a cost or payoff box removes the entry from the tree, so the engine reads it as left out, which is 0, and nothing on screen flags it: the tree rolls back, the cards fill, and the drawing looks complete. Clearing a probability box stores 0 and usually surfaces as a sum that is not 1. A blank or non-numeric cost reaches the engine only from a tree built outside the form, such as an imported file, and there the engine refuses it.

## The mistake

The careful mistake is checking only that the recommendation looks sensible. With the cost left out, the best branch is still A, so a reviewer who reads only the first move sees nothing wrong, while the EMV is overstated by the whole cost. The check that catches it is arithmetic: for each branch on the optimal path, confirm that the branch value equals the child value less the cost you meant to charge. Where they are equal, the cost was never charged.

## Exercise

For branch A, write what the engine returns when the cost is typed as "abc", as -5, when it is left out, and when the payoff is left empty. Say which three are refused and quote one message in full. Then say which of the four the Builder can produce by clearing a box, and what the engine reads there.
