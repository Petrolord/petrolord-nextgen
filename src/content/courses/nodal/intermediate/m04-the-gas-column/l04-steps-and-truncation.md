# Steps and truncation

The two station default is the published method. What matters is that its error is a friction problem and not a gravity one.

{{panel:pd-vlp-explorer}}

## The default is not a shortcut

`cullenderSmithBhp` defaults to two sub-intervals, which is the published two station method exactly: one interior station, two trapezoid halves, one Simpson pass. Two intervals carry a truncation error, and its size belongs to the function being integrated.

**The truncation is a friction problem, not a gravity one.** The goldens prove it on one string with only the rate changed: 8000 ft vertical, 2.441 in, 0.0006 in roughness, 0.65 gravity, 0.012 cp, 800 psia and 100 degF at the wellhead, 200 degF at the shoe. Converged is 256 sub-intervals.

| Case | MMscf/d | F squared | Converged, psia | Two station | Error, psi |
| --- | --- | --- | --- | --- | --- |
| staticVertical | 0 | none | 952.982971 | 952.972591 | -0.010380 |
| flowingVertical | 4 | 0.00182455 | 1069.628989 | 1069.621834 | -0.007156 |
| flowingHighRate | 9 | 0.00907182 | 1437.879989 | 1436.546872 | -1.333117 |

The error does not creep, it jumps. Two more goldens fill the small friction region: flowingDeviated at 0.00142657 truncates by 0.006723 psi, positive, prescribedFriction at 0.00288615 by -0.003223 psi. Down there the sign is not even consistent, a rounding rather than a bias.

## The step study

BONNY-7's injection column is static, gravity only. FORCADOS-3 carries 10.5 MMscf/d through 2.125 in at roughness 0.00040000, Reynolds 4321814.73, Moody 0.01603851, friction group 0.02721909.

| Steps | BONNY-7, psia | Error, psi | FORCADOS-3, psia | Error, psi |
| --- | --- | --- | --- | --- |
| 2 | 735.977254 | -0.01833744 | 2600.819216 | -7.54108245 |
| 4 | 735.990578 | -0.00501375 | 2605.268284 | -3.09201403 |
| 8 | 735.994311 | -0.00128077 | 2607.484094 | -0.87620389 |
| 20 | 735.995382 | -0.00020932 | 2608.220600 | -0.13969836 |
| 64 | 735.995572 | -0.00001939 | 2608.347754 | -0.01254415 |
| 256 | 735.995592 | 0.00000000 | 2608.360298 | 0.00000000 |

Both converge, the error falling roughly as the square of the step count. At the counts these wells run at, BONNY-7 uses sixteen for 735.995265 psia and -0.00032641 psi, FORCADOS-3 twenty four for 2608.264008 and -0.09629013 psi.

## Why friction breaks it

With no friction group the denominator is the squared density group alone, the integrand collapses to a smooth reciprocal, and a Simpson parabola through three points fits it almost exactly.

Add a friction group and the denominator holds two competing terms: friction dominates near the top where the gas is thin and fast, gravity near the shoe where it is dense. The integrand changes character partway along and two stations have nothing to bend with. They integrate a slowly varying thing well and a sharply varying thing badly.

## The mistake

Reporting the default on a friction-loaded column without its step count. The answer is low, consistently, and looks normal: 2600.819216 and 2608.360298 psia are both plausible for that well.

Refining removes a quadrature error and nothing else.

## Exercise

Step both columns through 2, 4, 8, 20, 64 and 256 sub-intervals. Write the two station row of each side by side and name the input that makes them different in kind.
