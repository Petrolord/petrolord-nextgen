# Every failure comes back ok

One module in this pair teaches you to read a field. The other one does not honour it.

{{panel:pd-fight-explorer}}

## What a refusal looks like

`buildNetwork` refuses a bad drawing and says why. A node with no route to a delivery point comes back with "This node has no route to a delivery point: Manifold B. Nothing sets its pressure, so the network cannot be solved. Connect it or take it out." A missing delivery point, a delivery point with no pressure, no wells at all, two nodes sharing an id and a node kind the module does not have come back the same way: `ok` false, one sentence, no repair. That teaches a caller to key on `ok`.

## What a failed solve looks like

`solveNetwork` returns `ok` true when the iteration cap is hit, when the line search stalls, and when it sits on a cusp it cannot resolve. Walk the cap on the teaching network AGBADA WEST and read the first column:

| maxIter | ok | converged | Reported residual, lb/d | Trunk, lb/d | Conservation gap, lb/d |
| --- | --- | --- | --- | --- | --- |
| 1 | true | false | 7.545876e+3 | 806.447063 | 16740.257197 |
| 2 | true | false | 5.456522e+3 | 5199.159519 | 11917.121949 |
| 3 | true | false | 1.503768e+3 | 11472.407575 | 3075.664586 |
| 4 | true | false | 1.318365e+3 | 12953.274475 | 351.415731 |
| 6 | true | false | 4.657099e+2 | 13166.936352 | 41.125860 |
| 8 | true | false | 2.201349e+0 | 12955.678542 | 345.000012 |
| 10 | true | false | 3.214654e-8 | 12955.677151 | 345.000000 |
| 11 | true | true | 1.546141e-11 | 12955.677151 | 345.000000 |

## The row that should frighten you

At a cap of one the return is complete: a manifold pressure of 267.202639 psia, a trunk of 806.447063 lb/d, a full set of node pressures, branch flows and well rates, `ok` true. The converged answer puts that manifold at 780.469728 psia and that trunk at 12955.677151 lb/d. Nothing in the shape of the object says which of the two you hold. `converged` says it, and `converged` is not the field the other module trained you to read.

## The one genuine ok false

A singular Jacobian: "The system is singular: two or more nodes move together, so their pressures are not separately determined. That is usually a branch connected differently from the way the drawing suggests." A diagnosis rather than a repair, and the only failure the solve refuses on.

## Read converged, then check anyway

The converged row still carries a `checkConservation` gap of 345 lb/d against 13300.677150912 lb/d produced, 2.593852900 percent. Reading `converged` instead of `ok` is necessary. It is not sufficient.

## Exercise

Write the field you would key on in a script consuming this solver, and name two failure modes it still misses. Then say what the cap of six row proves that the cap of eight row does not, given that the gap at six is the smaller of the two.
