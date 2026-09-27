# A risked prospect in stated terms

{{panel:farmout-deal-calculator}}

The first two modules priced the work. This module asks what the deal is worth to each side, and that needs a prospect stated in terms the engine can value: a chance of success, a well cost for each outcome and a success-case value. Every one of them is a stated input with no default. The Ekene Deep prospect states them all, and like every Ekene term it is synthetic.

## The Ekene Deep prospect's terms

| term | stated |
| --- | --- |
| chance of success | 25.000000 percent |
| well cost as a dry hole | 40000000.000000 |
| well cost on a success | 46000000.000000 |
| success-case value at 100 percent | 271250337.041807 |

The success-case value is the canonical npv of net cash flows from 2029 to 2045, discounted at 0.100000 (a fraction) to 2027. The cash flow course teaches discounting and NPV; this course takes the figure as the engine returns it.

## Each outcome has its own split

The deal is the Associate deal: FIN pays 40.000000 percent of the well to earn 30.000000 percent, under a gross-cost cap of 44000000.000000 with the excess paid by the post-deal interests. The two outcomes cost different amounts, so the cap acts on one and not the other:

| outcome | gross cost | farminee pays | farmor pays | carry | cap state |
| --- | --- | --- | --- | --- | --- |
| success | 46000000.000000 | 18200000.000000 | 14000000.000000 | 4400000.000000 | exceeded |
| dry hole | 40000000.000000 | 16000000.000000 | 12000000.000000 | 4000000.000000 | below |

## How a position is built

The engine states how it turns the terms into a payoff for each position:

> success = the interest of the success-case value less the share of the success well cost; dry hole = less the share of the dry-hole cost; the farmor receives the cash bonus and the reimbursement and pays the assignor fees in both outcomes

It also states when each figure falls. This is one of the readings the engine names, a choice of its own where the texts leave the matter open, and the Expert tier returns to it:

> the success-case value is at the valuation date; well costs, bonus, reimbursement and fees fall at the valuation date, undiscounted

## What the engine refuses

A chance of success is a percentage from 0 to 100, stated:

> project.chanceOfSuccessPct must be a number from 0 to 100; got 101

> project.chanceOfSuccessPct must be a number from 0 to 100; got nothing

Each well cost is stated too, and the dry-hole cost has no fallback:

> project.wellCost.dry must be a finite number at or above 0; got nothing

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Find the two rows of the well cost split and check them against the table above.
2. With the control "Chance of success, percent (stated)", set the chance to 101 and read the refusal. Then choose "not stated" and read it again.
3. Restore 25. With "Well cost on a success (stated)", set the cost to 40000000 and read the success row's cap state and carry.
