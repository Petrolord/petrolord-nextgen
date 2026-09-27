# A cash bonus

{{panel:farmout-earning-calculator}}

Work is not always the whole price. A farminee may also pay the farmor a sum of money when the deal is struck, on top of its share of the well. This course calls that sum the cash bonus. It is a stated term of the deal, and the engine holds no figure for it.

## A stated term with no default

The engine reads the cash bonus from the box and refuses a deal that leaves it out:

> cashBonus must be a finite number at or above 0; got nothing

The message says what the engine accepts: any amount at or above 0. A deal with no bonus states it as 0, and the engine records the choice in a reason line of its own:

> cash bonus: none (stated as 0)

So a missing bonus and a bonus of nothing are different things. The first is a gap in the terms, and the engine will not guess it. The second is a term, and the engine reports it.

## The bonus in the worked cases

| worked case | cash bonus (stated) |
| --- | --- |
| earn-ekene-single | 2000000.000000 |
| earn-bonus-and-reimbursement | 1500000.000000 |
| earn-heads-up | 0.000000 |
| earn-cap-gross-below | 0.000000 |

On the Ekene Deep deal FIN pays EKO a cash bonus of 2000000.000000. On the case `earn-bonus-and-reimbursement` the bonus is 1500000.000000.

## Where the bonus goes

The bonus moves money in one direction, from the farminee to the farmor, and it does not change the split of the well. On `earn-bonus-and-reimbursement`, FIN pays 16000000.000000 of the well whether the bonus is stated or not; the bonus is added on top.

The engine counts the bonus in two totals:

* in the farmor's **consideration**, beside the carry and the reimbursement;
* in the farminee's **outlay**, beside its well payment and the reimbursement.

The consideration line of the Ekene reasons shows it in place:

> consideration to EKO: carry 4400000 + cash bonus 2000000 + past-cost reimbursement 3600000 (30% of 12000000) = 10000000

The next lessons of this module take the reimbursement and the consideration in turn.

## A bonus and the value of the deal

A bonus is certain money. It is paid whether the well finds oil or not, so it weighs differently on each side from a well payment whose reward depends on success. The Professional tier weighs that difference by EMV. At this tier, read the bonus as one more stated line in the money that changes hands.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A cash bonus and a reimbursement". Read the "Cash bonus" tile, the "Consideration to the farmor" tile and the "Farminee outlay" tile. Then set the "Cash bonus (stated, 0 for none)" control to "not stated" and read the refusal. Set it to 0 and run it: check which tiles changed, which stayed the same, and read the new reason line for the bonus.
