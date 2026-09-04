# What the separator is told

The component rates that arrive are exact arithmetic on the well tests. The mass that arrives with them is not an answer to the network problem.

{{panel:pd-fight-explorer}}

## What was handed in

Four tested wells on the teaching network AGBADA WEST, each handed in with the mass the solve gave it: AGBADA-2 at oil 1690 stb/d, water 214 stb/d, gas 1305 Mscf/d; AGBADA-6 at 605, 738 and 542; AGBADA-9 at 1042, 369 and 1613; AGBADA-12 at 118, 401 and 76. Between them the four were tested at 3455.000000 stb/d oil, 1722.000000 stb/d water and 3536.000000 Mscf/d gas.

## What arrives

Oil 3455.000000000 stb/d, water 1722.000000000 stb/d, gas 3536.000000000 Mscf/d, mass 13300.677150912 lb/d. The three component rates are the sums of the tests to the last digit, because component rates ADD along the solved directions and the propagation does nothing else. That part is exact and it is exact even on the crosslink, which the solve runs backwards at 589.864625170 lb/d carrying oil 153.950443808 stb/d, water 54.517959468 stb/d and gas 238.312923093 Mscf/d.

## The mass is a different kind of number

The trunk the solve found carries 12955.677150912 lb/d. The trunk stream says 13300.677150912 lb/d. AGBADA-12 is allocated 985 lb/d on a flowline that cannot pass more than 640 lb/d, and the propagation was handed the allocation, so 345.000000000 lb/d reaches the separator on paper and nowhere else. The engine reports this answer `converged` true, 11 iterations, `residualLbD` 1.546141e-11 lb/d, `pinned` t4, and `checkConservation` on it reports produced 13300.677150912 lb/d against delivered 12955.677150912 lb/d, a gap of 345.000000000 lb/d, 2.593852900 percent.

## The ratio the separator must not be sized on

The trunk water cut is 33.262507244 percent. The four wells on their own are at 11.239495798, 54.951600894, 26.151665485 and 77.263969171 percent, and the plain average of those four is 42.401682837 percent, wrong by 9.139175594 percentage points. A water cut is a consequence of rates that added, never an input that averaged, and the error runs the way the rates are unequal rather than in some fixed direction. The published gate fixture prices the same habit on two wells: a trunk at 27.500000 percent against a plain average of 45.000000 percent, wrong by 17.500000 percentage points, a factor of 1.636364 on the number a facility would be sized against.

## The mistake

Sizing separation on the arriving mass because the arriving oil, water and gas were checked and matched. They match by construction: they are the tests added up. The mass beside them contains a shortfall the solve found and the propagation ignored, and `propagateStreams` returns `ok` true with no warning on exactly this case. The one refusal it does carry is topological, not a mass check: solved directions forming a loop come back `ok` false with the message that the network is recirculating.

## Exercise

Write the oil, water and gas arriving at the separator and compare each with the sum of the four well tests. Then write the arriving mass, the solved trunk flow, and say which of the four quantities you would refuse to hand a facility engineer without a second number beside it.
