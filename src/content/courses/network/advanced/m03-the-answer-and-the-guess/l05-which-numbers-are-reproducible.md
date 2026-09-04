# Which numbers are reproducible

A network answer holds three kinds of number and prints them all the same way. Sorting them is the whole skill.

{{panel:pd-fight-explorer}}

## Determined

A sink pressure is an input, so the separator on the teaching network comes back at 265.000000000 psia and could not have come back otherwise. Beyond that, the only determined pressures are the ones a closed form produced. On the published `linear_star` the closed form and Newton give 546.666666667 psia at w1, difference 0.0000e+0 psia, and 252.222222222 psia at h, difference -2.8422e-14 psia. Newton takes 2 iterations, `pinned` none, and `checkConservation` reports a gap of 7.275958e-12 lb/d.

## The last iterate

Every pressure on a network with a turbulent branch. Reversing the nodes array moves the unpinned nodes by at most 1.1369e-13 psia, so the elimination path does not decide them. Against the independent bisection oracle on the published `turbulent_tree`, the engine lands within -3.9037e-9 psia at h1, taking 6 Newton steps against 48 oracle sweeps. A last iterate two unrelated methods reach is a good number, and it is still not exact.

## Neither

The pressure of a pinned node. The same solve returns t4 at 831.176262, 400.000000, 600.000000, 1182.577035, 2000.000000 and 841.695631 psia depending only on where it started, and the reported rate follows at 985.000000, 640.000000 and 0.000000 lb/d. Read that carefully. The problem is not that the physics leaves this node free. AGBADA-12 is allocated 985 lb/d on a line passing 640.000000 lb/d, its allocation stops binding at 1013.848652 psia and its Vogel inflow equals the line capacity at 1182.577035 psia, so the node has exactly one correct pressure and the solver returns it from a high enough start. The engine default puts every unknown at the separator pressure, deep inside the flat top, and comes back at 831.176262 psia with `converged` true and a gap of 345.000000000 lb/d. Determined by the physics, undetermined by the solver, unmarked in `pressures`.

## How to sort them without running anything

Read `pinned` first: it names the entries of the third kind. Ask whether the branch relations were linear, the only condition under which a pressure is determined rather than iterated. Then read `checkConservation`, which the solver never calls for you. On the default answer it reports produced 13300.677150912 lb/d, delivered 12955.677150912 lb/d, gap 345.000000000 lb/d, 2.593852900 percent, against a reported residual of 1.546141e-11 lb/d.

## The mistake

Reading `pinned` as a note that a node did not matter. It marks a pressure the solver stopped deciding, not one the physics stopped deciding, and on this network a nonzero conservation gap is the signal that the two differ. A gap of 0.000000 lb/d is what the right answer looks like.

## Exercise

Sort every entry in `pressures` into determined, last iterate, or neither. Then say which of the three a `converged` flag speaks to, and which field tells you a pinned node is in the wrong place.
