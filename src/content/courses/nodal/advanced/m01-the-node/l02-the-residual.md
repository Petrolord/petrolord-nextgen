# The residual

Stop looking at two curves. Subtract one from the other and look at one.

{{panel:pd-node-explorer}}

## One function of rate

At any rate, take the pressure the tubing requires at the node and subtract the pressure the reservoir can supply there. That difference, in psi, is the residual.

Positive means the tubing is asking for more than the reservoir has, so the well is short and slows. Negative means surplus, so the well speeds up. Subtract the other way and every stability verdict in this tier inverts while still looking plausible.

Four situations become four readings of one curve. A crossing is a zero. Two crossings is a dip below zero and back. Tangency is a dip just touching. A dead well is a dip that never reaches zero.

## Three numbers describe a well

BONNY-7: -192.336636 psi at the lowest sampled rate of 4.324444 stb/d, a minimum of -989.578610 psi at 477.119848 stb/d, and +12517.903995 psi at the highest sampled rate. Residual sign changes = 1 change, so one crossing, at 1355.714057 stb/d.

FORCADOS-3: +575.820837 psi at the lowest sampled rate of 4.135950 stb/d, a minimum of -509.628610 psi at 985.078572 stb/d, and +3284.465003 psi at the highest. Sign changes = 2 changes, at 234.488087 and 2125.009203 stb/d.

Same sign at both ends forces an even count. FORCADOS-3 could never have had one crossing.

The golden deadWell has the dip too shallow: 988.172727 psi at 30.0000 stb/d, 1290.000000 psi at 300.0000 stb/d, 1940.762069 psi at 570.0000 stb/d. Status dead, 0 crossings. A dead well is a residual with no zero.

## A residual you can do by hand

The golden analyticResidualWide is built so the residual is a parabola, making both roots and both stability signs exact algebra with no search anywhere in the oracle. Its pinched companion is the same instrument with the dip raised.

| Rate, stb/d | Wide, psi | Pinched, psi |
| --- | --- | --- |
| 100.0000 | 770.000000 | 809.900000 |
| 500.0000 | 210.000000 | 249.900000 |
| 1000.0000 | -40.000000 | -0.100000 |
| 1500.0000 | 210.000000 | 249.900000 |
| 1900.0000 | 770.000000 | 809.900000 |

Wide crosses at 800.000000 and 1200.000000 stb/d, 400 stb/d apart. Pinched crosses at 990.000000 and 1010.000000 stb/d, 20.000000 stb/d apart. A minimum moved by tens of psi collapsed the gap twentyfold.

## What it refuses

It says nothing about why. FORCADOS-3's -509.628610 psi contains no account of whether the surplus came from a light column or a strong reservoir.

It is tied to one node, one set of boundary conditions, and one list of sampled rates. A dip living entirely between two samples contributes no sign change at all.

## Exercise

Record FORCADOS-3's residual at the lowest sampled rate, at its minimum, and at the highest sampled rate, with signs.

Then state how many crossings those three signs force, and what you would check before claiming there are no more.
