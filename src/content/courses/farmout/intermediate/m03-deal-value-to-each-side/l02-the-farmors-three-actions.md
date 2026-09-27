# The farmor's three actions

{{panel:farmout-deal-calculator}}

A farmor holding a prospect has three actions: drill it alone at its whole participating interest, farm it out on the stated terms, or walk away. The engine values each as an EMV and names the best. This lesson reads the three on the Ekene Deep prospect, where EKO is the farmor.

## The EMV the engine rolls back

The engine states its rule:

> EMV = p x success + (1 - p) x dry hole for each position, rolled back by rollback from engines/economics/decisionTree.js; walking away and declining are worth 0; ties are reported

The decision analysis course teaches decision trees and EMV as methods. Here the canonical rollback is applied to the positions a deal creates.

## EKO's three positions

At a chance of success of 25.000000 percent:

| action | participating interest | success | dry hole | EMV |
| --- | --- | --- | --- | --- |
| drill alone | 70.000000 | 157675235.929265 | -28000000.000000 | 18418808.982316 |
| farm out | 40.000000 | 99708134.816723 | -6792000.000000 | 19833033.704181 |
| walk away | 0.000000 | 0.000000 | 0.000000 | 0.000000 |

The engine's reasons for EKO:

> EKO alone (70%): success 157675235.93, dry hole -28000000, EMV 18418808.98

> EKO after the farm-out (40%, paying 14000000 of the success well and 12000000 of the dry hole): success 99708134.82, dry hole -6792000, EMV 19833033.7

## Reading the farm-out row

After the farm-out EKO holds 40.000000 percent of the success-case value and pays 14000000.000000 of the success well or 12000000.000000 of the dry hole. In both outcomes it also receives the cash bonus of 2000000.000000 and the reimbursement of 3600000.000000, and pays the assignor fees of 392000.000000. That is why the dry hole costs EKO far less after the deal: FIN pays part of EKO's share as the carry, and the cash arrives whatever the well finds.

EKO's best action is "farm out": its EMV of 19833033.704181 is above 18418808.982316 for drilling alone. The engine's reason names both sides' choices:

> EKO: the best action is farm out; FIN: decline

## The same prospect at the two ends of chance

The course states the Ekene Deep deal at a chance of 0 and of 100:

| chance of success | drill alone EMV | farm out EMV | best action |
| --- | --- | --- | --- |
| 0.000000 | -28000000.000000 | -6792000.000000 | walk away |
| 100.000000 | 157675235.929265 | 99708134.816723 | drill alone |

At a chance of 0 every EMV is its dry-hole payoff and walking away is best. At 100 every EMV is its success payoff and drilling alone is best. The farm-out wins in between, and the break-even chances of the next module show where.

## A tie is reported

When two actions have the same EMV the engine names both. The panel's best-action tile then reads "a tie" with every tied action listed. The next module meets a case where the farmor's drill-alone and farm-out actions tie exactly.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Find EKO's three rows in the positions table and the farmor's best-action tile.
2. Start from "A chance of success of 0" and then "A chance of success of 100". Read the farmor's best action on each.
3. Back on the Ekene Deep deal, set "Assignor fees the farmor pays (stated, 0 for none)" to 0. Read EKO's farm-out EMV and say how far each of its two payoffs moved.
