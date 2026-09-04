# The march and its steps

The gradient of the gas depends on the pressure, and the pressure is what the march is solving for. That circle is why the annulus is walked down in steps instead of evaluated in one shot.

{{panel:pd-column-explorer}}

## What one step is

Each step predicts the pressure at the bottom of the interval from the gradient at the top, then corrects it with the average of the gradients at both ends. That trapezoidal corrector is what makes the march second order, and second order is a claim that can be measured rather than believed.

Published column 1: surface 1014.7 psia, 8000.0 ft, sg 0.65, wellhead 100.0 degF, bottom 190.0 degF on a linear geotherm. The golden answer is 1215.716705320 psia, a total lift of 201.016705 psi and an average gradient of 0.025127088 psi/ft. That average hides a real spread, from 0.025405143 psi/ft at surface to 0.024893071 psi/ft at 8000 ft.

## Where the engine sets the step count

Two places, and they differ. Spacing and valve settings run the march at 20 steps. The plotted injection curve is tabulated at 40. Nothing else in the module changes it, so those are the two numbers a real design carries.

| Column | Golden, psia | Engine at 40 steps, psia | Difference, psi |
| --- | --- | --- | --- |
| 1 | 1215.716705320 | 1215.716830429 | 1.251e-4 |
| 2 | 1841.239804452 | 1841.240801720 | 9.973e-4 |
| 3 | 668.597603196 | 668.597615288 | 1.209e-5 |

## Marching back up is the same march

Recovering the surface pressure from the pressure at depth is a secant on the forward march, so it inherits whatever the forward march has and adds nothing. On the goldens the round trip closes to -1.930e-10 psi on column 1, -2.819e-10 psi on column 2 and -2.940e-10 psi on column 3. At the 40 step default the engine recovers 1014.699897424 psia against 1014.700000000 psia, a difference of -1.026e-4 psi, which is the forward error coming straight back.

## The mistake

Marching in one step. Column 1 at 1 step returns 1215.911062391 psia, an error of 1.9436e-1 psi, and column 2 at 1 step returns 1842.730189737 psia, an error of 1.4904e+0 psi. Neither looks absurd on a plot. The single step evaluates the gradient at one pressure and applies it over the whole hole, which is the flat rule of thumb with extra arithmetic.

## What the march refuses

Friction and velocity. The column is static, so there is no injection rate in the annulus at all, and a finer step count does nothing whatever about that. Refinement improves the answer to the question asked, never the question.

## Exercise

Run column 1 at 1 step and then at 40, and write both pressures at 8000 ft.

Then say which of the two differences matters more on this column: 1 step against 40, or 40 against the golden.
