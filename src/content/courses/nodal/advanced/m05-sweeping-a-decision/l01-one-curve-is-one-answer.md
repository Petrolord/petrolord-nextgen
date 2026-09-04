# One curve is one answer

A node solve returns a rate and a pressure. It does not return how firmly it believes them.

{{panel:pd-node-explorer}}

## Two results of identical shape

| Reading | BONNY-7 | FORCADOS-3 |
| --- | --- | --- |
| Operating rate, stb/d | 1355.714057 | 2125.009203 |
| Operating pressure, psia | 2062.142971 | 2366.909222 |
| Fraction of open flow | 0.31350017 | 0.51378991 |
| Drawdown, psi | 677.857029 | 1353.090778 |
| Right of the tubing minimum, stb/d | 728.644315 | 281.389786 |
| Above the tubing minimum, psi | 585.899719 | 18.717814 |

Both flowing, both stable, both on the rising friction limb. But 585.899719 psi and 18.717814 psi are not the same kind of stable, and the field saying so is not the status field.

## What the point is conditional on

The inflow family, its calibration, the tubing description, the solver setting. None appears beside the answer.

BONNY-7's test of 720 stb/d at 2380 psia sits above its bubble point of 1300 psia, so the straight line and the composite both back out 2.00000000 stb/d/psi. FORCADOS-3's test of 2400 stb/d at 2180 psia sits below its bubble point of 2450 psia, so the straight line backs out 1.55844156 stb/d/psi against the composite's 1.57194033, an error of -0.01349877, and an open flow of 5797.402597 stb/d against 4135.949669 and Vogel's 3946.987127.

The tubing is worth as much. Halving BONNY-7's friction constant from 0.00064 to 0.00032 psi per (stb/d)^2 moves the tubing minimum from 627.069742 stb/d and 1476.243252 psia to 845.667814 stb/d and 1309.348403 psia; doubling it to 0.00128 gives 455.992990 stb/d and 1656.374688 psia. A point 18.717814 psi above its shoulder does not shift slightly when that constant is wrong: the shoulder moves past the answer.

The shoulder is itself sampled. BONNY-7's 37 point curve gives a minimum at 604.341111 stb/d against a true 627.069742 stb/d, a sampled minus true minimum rate of -22.728631 stb/d; FORCADOS-3's 65 point curve gives -31.814966 stb/d.

## A trace carries what a point cannot

FORCADOS-3 swept on wellhead pressure gives 2246.821833 stb/d at 860 psia, 2125.009203 at 960, 1990.931611 at 1060 and 1842.012114 at 1160, with windows of 2064.445505, 1890.521117, 1695.613297 and 1473.513228 stb/d. The status reads flowing throughout while the margin falls steadily. A single solve at any one of the four hides the trend.

## The mistake

Treating a node result as a measurement. A rate quoted to nine figures reads as observed; it was computed from two models, one fitted to a single test and one described by three chosen constants. The related error is letting the open flow reassure, when it is the rate at zero flowing pressure and no well is ever there.

Never report a node point without the thing it is closest to losing: the clearance to the tubing minimum, and the window where there are two crossings.

## Exercise

Write the operating rate and pressure for both wells, then the distance to the tubing minimum in stb/d and in psi.

Say which you would quote without further work, and why the status field gave you no help deciding.
