# The slope test

Stability is the sign of one derivative: the rate of change of the residual at the crossing.

{{panel:pd-node-explorer}}

## The statement

The crossing holds if the residual is increasing there, which is to say if the outflow slope exceeds the inflow slope, both in psi per stb/d, both evaluated at the crossing rate.

Exceeds, not exceeds in magnitude. These are signed quantities.

## The inflow slope, tabulated

| Rate, stb/d | BONNY-7 | Rate, stb/d | FORCADOS-3 |
| --- | --- | --- | --- |
| 216 | -0.50000000 | 207 | -0.63615646 |
| 1297 | -0.50000000 | 1861 | -0.63615646 |
| 2595 | -0.50000000 | 2482 | -0.72224059 |
| 3243 | -0.57666066 | 3102 | -0.90914074 |
| 4195 | -1.57442483 | 4012 | -2.41200162 |

Always negative, and constant above the bubble point at minus one over the productivity index: -0.50000000 psi per stb/d for BONNY-7 with its index of 2.00000000 stb/d/psi, -0.63615646 for FORCADOS-3 with 1.57194033. That half is knowable before any solve.

## The outflow slope

Not tabulated, and not knowable in advance, because it depends on where the crossing lands. It is negative on the gravity limb, zero at the tubing minimum, which is 627.069742 stb/d for BONNY-7 and 1843.619418 stb/d for FORCADOS-3, and positive on the friction limb.

Its ingredients are printed. BONNY-7's gravity term falls from 2125.489174 psi at 4.32 stb/d to 171.562832 psi at 4324.44 stb/d while friction climbs from 0.011969 psi to 11968.524642 psi. Friction overtakes gravity at 968.379388 stb/d and 1620.331057 psia, and on FORCADOS-3 at 2718.933018 stb/d and 2512.445319 psia.

## Why the difference and not the sign

Subtracting a negative inflow slope adds margin: 0.50000000 psi per stb/d handed to BONNY-7 free, 0.63615646 to FORCADOS-3.

So the outflow slope need not be positive. It must only be greater than the inflow slope, and how much weaker that requirement is depends on how steep the inflow is. A steep inflow tolerates more falling outflow, not less.

## The mistakes

Testing one slope, which calls every crossing on a falling outflow unstable.

Comparing magnitudes. BONNY-7's -1.57442483 psi per stb/d at 4195 stb/d is larger in magnitude than -0.50000000 and smaller as a number. The test compares numbers.

Evaluating the two at different rates. FORCADOS-3's inflow slope is -0.63615646 psi per stb/d at 1861 stb/d and -0.90914074 at 3102 stb/d, and its outflow slope changes sign between them. A verdict built from two rates belongs to neither.

## What it refuses

It is local: it says nothing about how far the well can be displaced, which is what the window width is for.

It says nothing when the two slopes are equal. At tangency the residual's slope at the crossing is zero and the test does not resolve.

And it compares two fitted derivatives. Values interpolate well; slopes do not.

## Exercise

Read the inflow slope at the operating rate for each well and note which side of the tubing minimum rate the operating point lies on.

Then write the slope test as an inequality in words, and say which of its two terms you could have predicted without solving.
