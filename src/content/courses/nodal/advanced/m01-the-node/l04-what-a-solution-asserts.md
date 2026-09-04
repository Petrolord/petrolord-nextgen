# What a solution asserts

A converged answer is a list of claims, and the solver checked exactly one of them.

{{panel:pd-node-explorer}}

## The list

Reporting BONNY-7 at 1355.714057 stb/d and 2062.142971 psia asserts that the two curves read the same pressure there. It also asserts that the composite inflow, with a reservoir pressure of 2740 psia, a bubble point of 1300 psia and a productivity index of 2.00000000 stb/d/psi calibrated from one test of 720 stb/d at 2380 psia, is right. That the tubing constants, a gravity constant of 2150 psi, a lightening constant of 375 stb/d and a friction constant of 0.00064 psi per (stb/d)^2, are right. That the wellhead stays at 420 psia. That the well is at steady state. And that the 40 grid point scan looked hard enough.

Five inputs, one check.

## The same words, different comfort

| Quantity | BONNY-7 | FORCADOS-3 |
| --- | --- | --- |
| Operating rate, stb/d | 1355.714057 | 2125.009203 |
| Fraction of open flow | 0.31350017 | 0.51378991 |
| Drawdown, psi | 677.857029 | 1353.090778 |
| Above the tubing minimum, psi | 585.899719 | 18.717814 |
| Right of the tubing minimum, stb/d | 728.644315 | 281.389786 |

Both are reported flowing, both on the rising friction limb, both at 40 grid points. One is nearly six hundred psi clear of its tubing minimum and one is a handful of psi clear. A report that carries the words and not the margins has thrown that away.

## The claim inherited from one test

BONNY-7's test at 2380 psia sits above its bubble point, the controlled comparison. All three families reproduce 720.000000 stb/d at the test, and the straight line backs out 2.00000000 stb/d/psi against the composite's 2.00000000, an error of 0.00000000 stb/d/psi. Away from the test they diverge anyway: at 0 psia, 5480.000000 stb/d against 3233.247201 for Vogel and 4324.444444 for the composite.

FORCADOS-3's test at 2180 psia sits below its bubble point of 2450 psia, the corrupted comparison. The straight line backs out 1.55844156 stb/d/psi against the composite's 1.57194033, an error of -0.01349877 stb/d/psi, and an open flow of 5797.402597 stb/d against 4135.949669. At 1063 psia the two differ by 512.714276 stb/d.

The solver never looks at any of this. It converges just as cleanly on the wrong curve.

## Two crossings makes the report a choice

The golden compositeTwoCrossings carries the rule in its own note: the operating point is the reduction over the two crossings, not the first found. It reports 44.984487 stb/d at 2962.512928 psia marked stable no beside 1787.246675 stb/d at 1441.249529 psia marked stable yes.

So an answer on a two crossing well quietly assumes the well was brought above its lower crossing. Steady state arithmetic does not make that happen.

## Exercise

Write out the five inputs your answer depends on, then change exactly one and record how far the operating rate moved.

Say whether the size of that movement was predictable from the input you changed.
