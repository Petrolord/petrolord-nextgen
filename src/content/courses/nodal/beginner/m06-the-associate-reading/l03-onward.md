# Onward

The inflow says what the reservoir gives. The Professional tier says what the tubing accepts, and that curve does not fall.

## Why the shape is different in kind

An inflow curve falls from the reservoir pressure to the open flow and never turns: BONNY-7's slope is -0.50000000 psi per stb/d through its straight section, then -0.57666066 and -1.57442483. Monotone, which is why one bracketed search finds a unique inverse.

An outflow curve is two terms pulling opposite ways. BONNY-7's column has a gravity constant of 2150 psi and lightens on a scale set by a reference rate of 375 stb/d, so its gravity term falls from 2125.489174 psi at 4.32 stb/d to 601.970606 at 964.35 and 171.562832 at 4324.44. Its friction constant of 0.00064 psi per (stb/d) squared takes the friction term from 0.011969 psi to 595.182762 and 11968.524642 at those same rates.

The sum falls, reaches a minimum, then rises: 2545.501142 psia at 4.324444 stb/d, 1476.243252 psia at 627.069742 stb/d, 12560.087474 psia at 4324.444444 stb/d. The gravity share runs 0.99999437, 0.50283499 and 0.01413193 across those three, and friction overtakes gravity at 968.379388 stb/d and 1620.331057 psia.

## What lifts a curve and what reshapes it

Raise BONNY-7's wellhead pressure through 280, 350, 420 and 490 psia and the minimum bottomhole pressure goes 1336.243252, 1406.243252, 1476.243252 and 1546.243252 psia, the rate at the minimum fixed at 627.069742 stb/d. Change the friction constant and the turning point moves: 845.667814 stb/d at 1309.348403 psia for 0.00032, 627.069742 at 1476.243252 for 0.00064, 455.992990 at 1656.374688 for 0.00128.

## A relation that has to be integrated

A dry gas column has no algebraic bottomhole pressure, so Cullender and Smith marches down the string. The two-station default costs -0.010380 psi on a static gravity column and -1.333117 psi on the same string at 9 MMscf/d: a friction problem, not a gravity one. BONNY-7's lift gas column converges -0.01833744, -0.00501375, -0.00128077, -0.00020932, -0.00001939 and 0.00000000 psi at 2, 4, 8, 20, 64 and 256 steps.

## And then the node

FORCADOS-3's dead column stands at 4310 psia against a reservoir pressure of 3720 psia, so the curves cross twice, at 234.488087 stb/d and 3570.828888 psia and at 2125.009203 stb/d and 2366.909222 psia. Only the second holds. Choke it until the two crossings sit 57.851719 stb/d apart and 40 scan points find the well, 50 report it dead and 60 find it again, with a minimum residual of -0.478610 psi throughout.

## What you take with you

The calibrated relation, the index, the reservoir pressure, the bubble point, the open flow, and above all the inverse reading. The outflow gives the pressure the tubing requires at the same rate; subtract one from the other and the zeros of that residual are the operating points.

## Exercise

Write BONNY-7's inverse readings at 1946, 2595 and 3243 stb/d: 1767.000000, 1442.500000 and 1105.576792 psia. Leave a blank column for what the tubing requires at each, and say what the sign of the difference would tell you.
