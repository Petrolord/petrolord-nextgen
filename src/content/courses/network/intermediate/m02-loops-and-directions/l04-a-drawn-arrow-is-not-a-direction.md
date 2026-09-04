# A drawn arrow is not a direction

An arrow on a network drawing records which way somebody expected the mass to go. The solve decides which way it goes, and on the teaching network AGBADA WEST the two disagree.

{{panel:pd-network-explorer}}

## The branch that runs the other way

The crosslink c2 is drawn from the north manifold ha to the loop tee hb at a conductance of 540 lb/d per root psi. The solve returns its flow as -589.864625170 lb/d. Flows are signed from the drawn `from` to the drawn `to`, so it carries 589.864625170 lb/d from hb into ha, against its arrow.

The pressures say the same. ha solves to 780.469728020 psia and hb to 781.662938843 psia, so the pressure across c2 in the drawn sense is -1.193210823 psi: the drawn downstream end is the higher of the two.

## Why it reverses

The loop tee is fed by one well, AGBADA-9, through a stiff flowline at 198 lb/d per root psi. The north manifold is fed by three wells through 275, 365 and 126 lb/d per root psi and carries five branches. At the solution the loop tee therefore sits above the manifold and the crosslink drains toward it. The drawing was a guess made before anybody solved anything.

## The sign belongs to the solution, not to the branch

A derived sweep on the teaching network, not a published case, walking the crosslink conductance alone:

| Crosslink, lb/d per root psi | Manifold, psia | Loop tee, psia | Crosslink flow, lb/d |
| --- | --- | --- | --- |
| 60 | 771.802819 | 805.201424 | -346.749154 |
| 150 | 777.638390 | 789.225300 | -510.593269 |
| 300 | 779.804050 | 783.429774 | -571.240028 |
| 540 | 780.469728 | 781.662939 | -589.864625 |
| 900 | 780.676772 | 781.114804 | -595.655783 |
| 1400 | 780.746949 | 780.929167 | -597.618496 |

Every row is negative and no size of pipe fixes it. The two ends close on each other as the branch is opened, so the pressure difference falls from -33.398604 psi to -0.182218 psi while the mass rises.

## What names it, and what does not

`diagnose` reports backflows = c2 (Crosslink) at -589.864625 lb/d, and dead legs = none. That is the only place in the result where the reversal is named. Nothing refuses and nothing warns: the flow carries a minus sign a reader skimming magnitudes will not see.

## The mistake, and what the check says

Reading the drawn arrow as a direction and splitting the streams along it. Everything downstream of that node comes out wrong at full size, not as a small error.

This answer reported converged = true after 11 iterations at a residual of 1.546141e-11 lb/d. `checkConservation` on it reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345.000000000 lb/d, 2.593852900 percent. The direction is right and the mass balance is not.

## Exercise

Solve the teaching network and record the crosslink flow with its sign. Say which node the mass is leaving, and name every branch whose stream split changes if you take the arrow at face value.
