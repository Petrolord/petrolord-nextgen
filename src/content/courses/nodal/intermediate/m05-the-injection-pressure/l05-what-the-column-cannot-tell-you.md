# What the column cannot tell you

The pressure at depth is one input to three decisions, and it is not any of them.

{{panel:pd-vlp-explorer}}

## The claim, and its audit

Gas enters a dry annulus at a stated surface pressure, and at a stated depth the pressure is a stated number. That claim is checkable: the defining integral has a target of 18.75 times the gas gravity times the measured depth. BONNY-7 achieves 76633.1434 psi units against 76631.2500, FORCADOS-3 138618.9944 against 138600.0000. Everything past that sentence needs inputs the column does not take.

## It does not say what the well produces

BONNY-7 produces 1355.714057 stb/d at 2062.142971 psia, which is 0.31350017 of its open flow at a drawdown of 677.857029 psi. That figure comes from a reservoir at 2740 psia, a composite inflow relation at a productivity index of 2.00000000 stb/d/psi, meeting a tubing curve whose minimum sits at 627.069742 stb/d and 1476.243252 psia.

The annulus column appears nowhere in that chain. Gas lift does change production, by lightening the mixture and moving the tubing curve, which is the tubing model's work. The column decides only whether gas can get in.

## It does not choose the rate it is handed

The rate is an input, and the answer moves with it: FORCADOS-3's column at 10.5 MMscf/d through 2.125 in reaches 2608.360298 psia at a friction group of 0.02721909. It is chosen on the other side. BONNY-7's lightening constant at 187.50, 375.00, 750.00 and 1500.00 stb/d puts the tubing minimum at 561.403918, 627.069742, 646.294276 and 581.492476 stb/d, and at 1159.998265, 1476.243252, 1842.168146 and 2185.774480 psia. The rate climbs, turns and falls back while the pressure rises throughout: an optimisation with a turning point, to which the column contributes one constraint.

## It is a snapshot, not a sequence

Unloading is a sequence: the annulus level pushed down, gas passing the top valve, the tubing lightening, the next valve uncovered, the valves above closing behind it. Each stage has its own pressures and its own valves open and shut, and the column returns one pressure at one depth for one condition.

Nor can it see liquid carried into the annulus, a temperature profile that is not a straight line, or a composition a gravity based correlation misses.

## The mistake

The annulus at 6700 ft has 735.995592 psia, therefore the valve there opens, therefore the well lifts from 6700 ft. The second and third do not follow from the first.

The wrong answer is not a wrong number: the pressure is correct and auditable. It is a conclusion, wrong in whichever direction the missing inputs point, so inspecting it catches nothing. Write the claim beside the number: annulus pressure at a stated depth, at a stated step count, on a dry column.

## Exercise

Name the three questions the column does not answer, and for each an input it would need and does not take.

Then state, in one sentence you would sign, what it does answer.
