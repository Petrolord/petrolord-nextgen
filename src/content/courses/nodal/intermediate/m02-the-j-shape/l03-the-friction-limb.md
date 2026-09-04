# The friction limb

A square law with no ceiling, which is why it always wins in the end and why the end is a rate nobody will run.

{{panel:pd-vlp-explorer}}

## The term

A constant times rate squared: 0.00064 psi per (stb/d) squared on BONNY-7, 0.000105 on FORCADOS-3. It starts at nothing, is unbounded, and has no natural scale.

| BONNY-7 rate, stb/d | Friction term, psi | FORCADOS-3 rate, stb/d | Friction term, psi |
| --- | --- | --- | --- |
| 4.32 | 0.011969 | 4.14 | 0.001796 |
| 484.34 | 150.133173 | 520.61 | 28.458942 |
| 964.35 | 595.182762 | 1037.09 | 112.933210 |
| 1924.38 | 2370.067092 | 2070.04 | 449.933109 |
| 2884.40 | 5324.664959 | 3103.00 | 1011.001495 |
| 4324.44 | 11968.524642 | 4135.95 | 1796.138365 |

At 964.35 stb/d BONNY-7 pays 595.182762 psi; at 1924.38 stb/d, near double, it pays 2370.067092 psi, near quadruple.

## Why the square is fair

Once turbulent the Moody factor stops moving and velocity squared carries the loss.

| Reynolds number | Relative roughness | Moody friction factor |
| --- | --- | --- |
| 1200 | 0.0002 | 0.05333333 |
| 3000 | 0.0002 | 0.03605480 |
| 50000 | 0.0002456 | 0.02174609 |
| 2000000 | 0.0002456 | 0.01476271 |
| 10000000 | 0.00001 | 0.00899571 |

On a real string, 4 MMscf/d in 2.441 in gives a Reynolds number of 1776205.11 and a factor of 0.01481660; 9 MMscf/d gives 3996461.49 and 0.01455199.

## Diameter, to the fifth power

The published friction group is a factor times rate squared over the FIFTH power of the bore, so a 2.992 in column at 6 MMscf/d carries 0.00142657 against a 2.441 in column at 4 MMscf/d carrying 0.00182455. Higher rate, smaller group. FORCADOS-3's injection column is the other extreme: 10.5 MMscf/d down 2.125 in at a Reynolds number of 4321814.73, factor 0.01603851, group 0.02721909.

## Where the limb starts

Not where friction is present, but where it is winning: 968.379388 stb/d on BONNY-7, 2718.933018 on FORCADOS-3. The limb itself is defined by the SLOPE of the sum, so FORCADOS-3 rises across a wide band while gravity is still 0.53444210 of its bill at 2586.52 stb/d and 0.23582291 at its bound.

The limb is the only restoring force the tubing has. BONNY-7 climbs from 1476.243252 psia at its bottom to 12560.087474; FORCADOS-3 from 2348.191408 to 3310.421637 psia. The gentle one is harder to hold steady.

## What it refuses, and the mistake

Most of the limb is arithmetic about a well that cannot exist: 11968.524642 psi at 4324.44 stb/d against a 2740 psia reservoir. The coefficient is constant where a real one moves with water cut, scale and wax, and there is no acceleration term.

So a big friction number is not a case for bigger tubing until you check its rate. BONNY-7's 3699.901834 psi at 2404.39 stb/d is unreachable; at 484.34 stb/d it is 150.133173 psi with a gravity share of 0.86205504. The reverse error is as common: FORCADOS-3's friction tops out at a modest 1796.138365 psi and is still the entire reason its curve turns at 1843.619418 stb/d.

## Exercise

In the panel, read BONNY-7's friction term at 964.35 and 1924.38 stb/d.

Then explain how a 2.992 in column at 6 MMscf/d ends up below a 2.441 in column at 4 MMscf/d.
