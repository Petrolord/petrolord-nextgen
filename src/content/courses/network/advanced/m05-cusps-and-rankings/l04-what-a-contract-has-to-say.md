# What a contract has to say

The module header states what it needs from the two callbacks it is handed, and checks neither at the door.

{{panel:pd-fight-explorer}}

## What the header asks of a well

`wellInflow` must be monotone DECREASING in pressure. A Vogel curve is: raise the wellhead and the well makes less, all the way. A well held to a facility allocation, a choke limit or a compressor slot is monotone NON-increasing, with a flat top where more drawdown buys nothing. Non-increasing passes a loose reading of that sentence and fails a strict one. A flat top zeroes the node's Jacobian row, and a zero row is what gets it pinned and taken out of the measurement.

## An entirely reasonable well

AGBADA-12 is allocated 985 lb/d on a flowline that cannot pass more than 640 lb/d in either direction, a shortfall of 345 lb/d by construction. Walking the allocation across that capacity changes one word and one number nobody sees.

| Allocation, lb/d | pinned | Gap, lb/d |
| --- | --- | --- |
| 300 | none | 0.000000 |
| 500 | none | -0.000000 |
| 620 | none | -0.000000 |
| 640 | none | 0.000000 |
| 660 | t4 | 20.000000 |
| 800 | t4 | 160.000000 |
| 985 | t4 | 345.000000 |
| 1300 | t4 | 660.000000 |

Every row reports `converged` true, and on every pinned row the flowline is at 640.000000 lb/d. The two rows printing a negative zero are the solver arriving from the other side, as clean as the plain zeros.

## What the door does check

`buildNetwork` refuses eleven malformed networks with `ok` false and a sentence: a node with no route to a delivery point, a delivery point with no pressure, a kind that is not one of well, junction, sink. Every one is topology or identity. Not one looks at a callback. The requirement that decides whether an answer means anything is enforced nowhere.

## The same gap on the branch side

A branch relation must be "continuous and monotone decreasing in pTo", and the turbulent law is both. The Jacobian is differenced with a step of about 0.007805 psi at the teaching junction pressures, so what the solver consumes is a slope the contract never asked for. Two clauses, one shape of failure: a defensible relation satisfies the sentence and breaks the method.

## What the solve says where the allocation binds

At 985 lb/d the engine reports `converged` true after 11 iterations at 1.546141e-11 lb/d. `checkConservation` on the same answer reports 13300.677150912 lb/d produced against 12955.677150912 lb/d delivered, 345.000000000 lb/d of gap, 2.593852900 percent.

## Exercise

Write the two requirements the header states on its callbacks, and beside each the relation that satisfies it and breaks the solve.

Then say what a door check would have to evaluate to catch the allocated well.
