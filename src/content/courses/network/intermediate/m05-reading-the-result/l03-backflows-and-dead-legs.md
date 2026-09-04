# Backflows and dead legs

A backflow is not a fault. It is a branch the solve found running against the way somebody drew it, and the drawing was a guess made before anything was solved.

{{panel:pd-network-explorer}}

## What the list contains

On AGBADA WEST `diagnose` returns backflows = the crosslink at -589.864625 lb/d, and dead legs = none. A dead leg is a branch the solve found carrying nothing, and here every branch carries something. It is drawn from the north manifold to the loop tee, and the solve returns -589.864625170 lb/d, so it carries 589.864625170 lb/d from the tee into the manifold. The pressure across it is -1.193210823 psi in the drawn sense: the drawn downstream end is the higher of the two.

The reason is topology. The loop tee is fed by one well through a stiff flowline of 198 lb/d per root psi and the manifold by three through slacker ones, so the tee sits above the manifold and the crosslink drains toward it.

## The sign belongs to the solution

Walk the crosslink conductance and the direction never changes, only the size.

| Crosslink conductance, lb/d per root psi | Manifold, psia | Loop tee, psia | Crosslink, lb/d |
| --- | --- | --- | --- |
| 60 | 771.802819 | 805.201424 | -346.749154 |
| 150 | 777.638390 | 789.225300 | -510.593269 |
| 300 | 779.804050 | 783.429774 | -571.240028 |
| 540 | 780.469728 | 781.662939 | -589.864625 |
| 900 | 780.676772 | 781.114804 | -595.655783 |
| 1400 | 780.746949 | 780.929167 | -597.618496 |

A fatter crosslink carries more and squeezes the junction pressures together: the drawn difference shrinks from -33.398604 psi to -0.182218 psi, while the trunk moves only from 12949.424167 lb/d to 12955.836128 lb/d. Sweep points on a teaching network, not published cases.

## What the check says about the same answer

The solve at 540 lb/d per root psi reported converged = true after 11 iterations at a residual of 1.546141e-11 lb/d. `checkConservation` on it reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345 lb/d, 2.593852900 percent.

## What the diagnosis refuses to do

Naming the branch is all it does. It will not reverse the drawing or re-label the ends, and every later reading of it stays in the drawn sense.

It refuses one thing outright. If the solved directions close a cycle, propagation stops: "The solved flow directions form a loop, so the network is recirculating. A gathering system does not do that; check for a branch connected backwards."

## The careful mistake

Believing the arrow. Take the crosslink at face value and the loop tee becomes a junction with one way out, its stream of 153.950443808 stb/d oil, 54.517959468 stb/d water and 238.312923093 Mscf/d gas runs into that tee rather than out, and every total past the manifold is wrong by a stream nobody subtracted.

## Exercise

List the backflows and dead legs on the panel, and for each backflow write the drawn direction, the signed flow and the true one.

Then walk a crosslink conductance up and down and say what the sign does.
