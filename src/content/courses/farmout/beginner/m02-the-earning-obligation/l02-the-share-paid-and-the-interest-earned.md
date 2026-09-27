# The share paid and the interest earned

{{panel:farmout-earning-calculator}}

Two stated terms define an earning event: the share of the gross cost the farminee pays, and the participating interest it earns. Everything the engine returns for the event comes from those two percentages and the gross cost. This lesson reads the two terms, what the engine does with them, and the limits it checks.

## The rule the engine applies

The engine states its rule in the basis of every earning result:

> gross-cost: the promote applies to the gross cost up to the cap, the excess by the stated overrun rule; carry-amount: the carry is held at the cap and the farmor pays the rest of its own share; none: no cap. Every cap, share and interest is a stated input with no default

The first part of that rule is about caps, which the Professional tier works. With no cap, the rule is short: the farminee pays its stated share of the whole gross cost, and the farmor pays the rest of its own pre-deal share.

## A well with no cap

The worked case `earn-bonus-and-reimbursement` states EKO at 70.000000 percent and PA at 30.000000, a well of 40000000.000000, and FIN paying 40.000000 percent to earn 30.000000 percent, with no cap.

| figure | engine |
| --- | --- |
| FIN pays | 16000000.000000 |
| EKO pays | 12000000.000000 |
| participating interest FIN holds after the event | 30.000000 |
| promote ratio | 1.333333 |

FIN pays 40.000000 percent of the well. EKO held 70.000000 percent before the deal and pays what is left of its share after FIN's payment: its share of the well less the part FIN covers.

## Three limits on the two terms

The engine checks each term against the farmor's participating interest and refuses a deal that breaks one. A farminee that pays less than the participating interest it earns would take a negative promote:

> events[0].farmineePaysPct must be at or above 30, the interest the farminee holds after the event (a promote of 0 or more); got 25

A farminee pays only the farmor's side of the well, so it cannot pay more than the farmor's pre-deal share:

> events[0].farmineePaysPct must be at most 70, the farmor's interest before the deal (the farminee pays no other party's share); got 75

And the participating interest earned comes out of the farmor's alone:

> events[0].earnedPct must be at most 70, the farmor's interest 70 less 0 already earned; got 71

## What the two terms leave out

The share paid and the participating interest earned say nothing about cash. A cash bonus and a past-cost reimbursement are separate stated terms, taken up in a later module. They also say nothing about value: whether 40.000000 for 30.000000 is a good trade for either side depends on the chance of success and the payoffs, which the Professional tier weighs by EMV.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A cash bonus and a reimbursement". Check the four figures in the table above. Then use the "event 1: share the farminee pays, percent (stated)" control to set 25 and read the refusal; set 75 and read the next one. Restore 40, then set the participating interest earned to 71 and read which field and which limit the engine names this time; compare the message with the three above. Restore 30.
