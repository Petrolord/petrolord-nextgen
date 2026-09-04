# The bottleneck

The branch eating the most pressure per unit of what it carries. That is a different question from the biggest drop, and on one network the two name different branches.

{{panel:pd-network-explorer}}

## The intensity

`diagnose` divides a branch drop by the mass on it and ranks the result. The published gate fixture shows why. In the first case a flowline at 100.000000 psi over 40000.000000 lb/d scores 2.500000e-3 psi per lb/d, a choked one at 600.000000 psi over 2000.000000 lb/d scores 3.000000e-1, and the trunk at 200.000000 psi over 42000.000000 lb/d scores 4.761905e-3. Biggest drop and bottleneck both land on the choked leg.

The second case is the one to remember. The flowline is at 50.000000 psi over 40000.000000 lb/d, the choked leg at 150.000000 psi over 300.000000 lb/d and the trunk at 250.000000 psi over 40300.000000 lb/d. The biggest drop is now the trunk. The bottleneck is still the choked leg, at 5.000000e-1 against the trunk's 6.203474e-3.

## The ranking on a whole system

| Branch | Drop, psi | Mass, lb/d | Intensity, psi per lb/d |
| --- | --- | --- | --- |
| AGBADA-9 flowline | 406.581740456 | 3992.446687538 | 1.018377e-1 |
| AGBADA-2 flowline | 476.806785609 | 6004.874117054 | 7.940329e-2 |
| AGBADA-12 flowline | 50.706533886 | 640.000000000 | 7.922896e-2 |
| Loop leg | 192.879045250 | 3402.582062368 | 5.668608e-2 |
| Trunk | 323.783893593 | 12955.677150912 | 2.499166e-2 |
| North bypass | 191.685834427 | 9553.095088544 | 2.006531e-2 |
| AGBADA-6 flowline | 40.343600289 | 2318.356346320 | 1.740181e-2 |
| Crosslink | -1.193210823 | -589.864625170 | 2.022855e-3 |

The bottleneck is the AGBADA-9 flowline at 1.018377e-1, and the biggest drop is the AGBADA-2 flowline at 476.806786 psi. Two readings, two branches, one solve.

## The row that should slow you down

The AGBADA-12 flowline is third at 7.922896e-2, on 50.706533886 psi and 640.000000000 lb/d. It looks like a restriction and is not one to fix: that well is held to an allocation of 985 lb/d on a line capped at 640 lb/d in either direction, so the line sits at its limit by instruction. A small mass in the denominator lifts a branch up the ranking whether or not the smallness is a pipe problem.

## What the check says about the same answer

The intensities come from a solve reporting converged = true after 11 iterations at a residual of 1.546141e-11 lb/d, and `checkConservation` on that answer reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345 lb/d, 2.593852900 percent. Both columns of the ranking came out of the iteration that produced the answer.

## What the ranking refuses to do

Its units are arbitrary and only the order is used, so an intensity is not a severity and two of them do not subtract into anything. It will not price a fix either: the module has no pump, no compressor and no choke as a node kind, and no equipment between nodes at all.

## Exercise

Read the bottleneck and the biggest drop on the panel and write both, with their numbers and their units.

Then find a branch high in the ranking whose intensity comes from a small mass rather than a large drop, and say what you would check before calling it a restriction.
