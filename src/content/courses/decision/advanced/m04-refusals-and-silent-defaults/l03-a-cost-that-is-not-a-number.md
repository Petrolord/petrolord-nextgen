# A cost that is not a number

The rollback engine refuses a payoff that is not a number and accepts a cost that is not a number, charging it as zero. The asymmetry is a property of the engine as published, and it is invisible in the result.

{{panel:ec-judgement-explorer}}

## One decision, eleven inputs

Branch A pays 20 at the cost shown, and branch B pays 12 at no cost. The correct reading is a cost of 5: A is worth 20 less 5, which is 15.0000, and A beats B.

| what was typed on A | result | best | branch A value |
| --- | --- | --- | --- |
| cost 5 | emv 15.0000 | A | 15.0000 |
| cost "5" as text | emv 15.0000 | A | 15.0000 |
| cost "abc" | emv 20.0000 | A | 20.0000 |
| cost left empty "" | emv 20.0000 | A | 20.0000 |
| cost absent | emv 20.0000 | A | 20.0000 |
| cost -5, a receipt | emv 25.0000 | A | 25.0000 |
| payoff "20" as text | emv 15.0000 | A | 15.0000 |
| payoff "" | emv 12.0000 | B | -5.0000 |
| payoff null | emv 12.0000 | B | -5.0000 |
| payoff "20abc" | refused | | |
| payoff with p50 20 and no mean | refused | | |

## Costs fall silently to zero

Text that reads as a number is converted, so "5" behaves like 5. Anything else, "abc", an empty box or no cost at all, is charged as 0, and branch A reads 20.0000. The root EMV rises by the cost that went missing, from 15.0000 to 20.0000, and nothing in the output says a cost was dropped. A negative cost is accepted as money received, which is legitimate for a farm-in carry and a typing error for everything else: A reads 25.0000.

The published missingCostAndNullPayoff case shows the same rule in a tree: branch values "A" 0.0000 and "B" 3.0000, emv 3.0000, best B.

## Payoffs are checked, up to a point

A payoff of "20abc" is refused with `Terminal payoff is not a number`, and a distribution summary without a mean is refused with `Distribution payoff has no finite mean`. An empty payoff and a null payoff are not refused. Both are read as 0, so branch A becomes 0 less the cost of 5, which is -5.0000, and the choice flips to B at 12.0000. A payoff that went missing is the more dangerous of the two defaults, because it can change the recommendation as well as the value.

## The Builder stores zero

In the Decision Tree Builder, clearing a payoff, probability or cost box stores 0, the same value the engine gives a blank or non-numeric cost. A cleared probability usually surfaces as a sum that is not 1 and is refused. A cleared cost or payoff is silent: the tree rolls back, the cards fill, and the drawing looks complete.

## The mistake

The careful mistake is checking only that the recommendation looks sensible. In the "abc" row the best branch is still A, so a reviewer who reads only the first move sees nothing wrong, while the EMV is overstated by the whole cost. The check that catches it is arithmetic: for each branch on the optimal path, confirm that the branch value equals the child value less the cost you meant to charge. Where they are equal, the cost was never charged.

## Exercise

For branch A, write the branch value and the best branch when the cost is typed as "abc", as -5, and when the payoff is left empty. Then say which of the three changes the recommendation, and which input on this decision the engine refuses outright.
