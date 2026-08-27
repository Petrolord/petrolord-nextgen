# The fit recovers the plant

Before trusting a fitting tool on real data, you make it prove itself on data whose answer you already know. The Ekene teaching field gives us exactly that: the sand's rock curves were designed as Corey with $n_w = 2.5$ and $n_o = 2.0$, so a lab table sampled from those curves is a plant. If the fit cannot dig the plant back out, nothing it says about real core is worth reading. This lesson runs that test end to end.

## The lab table

The table is the Ekene design sampled at thirteen evenly spaced saturations across the mobile window, from connate 0.35 to residual-oil 0.75, a step of one thirtieth. Here it is at full engine precision:

| $S_w$ | $k_{rw}$ | $k_{ro}$ |
|---|---|---|
| 0.35 | 0 | 0.9 |
| 0.3833333333333333 | 0.0006014065304058598 | 0.7562500000000001 |
| 0.41666666666666663 | 0.0034020690871988564 | 0.6250000000000001 |
| 0.45 | 0.009375000000000003 | 0.50625 |
| 0.4833333333333333 | 0.019245008972987514 | 0.4000000000000001 |
| 0.5166666666666666 | 0.03361964710249492 | 0.3062500000000002 |
| 0.55 | 0.05303300858899109 | 0.2249999999999999 |
| 0.5833333333333334 | 0.0779674336989015 | 0.1562499999999999 |
| 0.6166666666666667 | 0.1088662107903635 | 0.09999999999999996 |
| 0.6499999999999999 | 0.1461417868886239 | 0.0562500000000001 |
| 0.6833333333333333 | 0.1901814435781827 | 0.02499999999999999 |
| 0.7166666666666667 | 0.24135141674691027 | 0.006249999999999989 |
| 0.75 | 0.3 | 0 |

Thirteen rows, two curves, twenty six curve points. Two of them are the definitional endpoint zeros from lesson 1, so twenty four points enter the residual vector.

## What the fit returns

Handed this table with the endpoints held fixed at what the table itself implies, connate 0.35 from the first row and residual 0.25 from one minus the last row, the engine returns:

| quantity | value |
|---|---|
| $n_w$ | 2.4999999999999996 |
| $n_o$ | 2 |
| rmsLog | 1.3784958753881249e-16 |
| r2Log | 1 |
| converged | true |
| iterations | 4 |
| pointsUsed | 24 |

Read the exponents first. The plant was 2.5 and 2.0; the fit says 2.4999999999999996 and 2. The water exponent is off by two units in the sixteenth significant figure, which is the double-precision representation itself, not a fitting error. The rmsLog says the same thing in a different register: the root-mean-square logarithmic mismatch over all twenty four points is about $1.4 \times 10^{-16}$, meaning the largest relative error anywhere on either curve is at the level of machine rounding. Four iterations from the neutral start of $n_w = n_o = 2$ is the kernel telling you the objective is smooth and the answer nearby.

The count of twenty four matters as much as the exponents. Twenty six curve points went in, the floor removed exactly the two endpoint zeros, and everything else survived. On this synthetic table the second row's $k_{rw}$ of 0.0006014065304058598 clears the $10^{-4}$ floor comfortably. On a real core report a value that small might not, and the pointsUsed field is where you find out what the fit actually saw.

## Why a perfect recovery is the right test and not a rigged one

It can feel circular: sample a Corey model, fit a Corey model, applaud when it matches. The point is what would happen if any link in the chain were broken. A wrong residual definition, a floor that ate live points, an index slip in the Jacobian, a bound clamped too early, any of these would smear the recovered exponents away from the plant by far more than $10^{-16}$. A fit that recovers a plant proves the machinery transmits information without loss. What it deliberately does not test is noise, and that is honest: noise robustness is a property of your data, not of the arithmetic. The capstone grades your fitted $n_w$ against 2.4999999999999996 at a tolerance of 0.001, wide enough for any correct route and narrow enough that a broken one fails.

## At the panel

{{panel:sc-design-explorer}}

Put the panel in its fit mode. It carries the same thirteen-row lab grid and runs the same `fitCoreyToKrTable` call you have just read about. Check the three tiles against this lesson: the fitted $n_w$, the fitted $n_o$, and the rmsLog. Confirm the water exponent tile shows the recovery of 2.5 and that the rmsLog tile is displaying a number at the $10^{-16}$ scale rather than something merely small like $10^{-3}$. The gap between those two magnitudes is the gap between a fit that is consistent with the data and a fit that IS the data.

## The misconception to avoid

The misconception is reading 2.4999999999999996 as a fit that missed 2.5. It did not miss. The number is the closest a 64-bit float can land to the true minimum given the rounding of the twenty four residuals, and the rmsLog of $10^{-16}$ proves there is no daylight between model and table. Chasing the last digits of a fitted parameter below the precision of its inputs is not rigor. On real data the meaningful resolution is set by the confidence interval, which is the next lesson.

## Exercise

First, count the arithmetic yourself: state why pointsUsed is 24 and not 26, naming the two excluded points by their saturations, and say what pointsUsed would become if a lab report listed the second row's water value as 0.00008 instead of 0.0006014065304058598.

Second, suppose a colleague fits the same table but reports $n_w = 2.62$ with an rmsLog of 0.04. Using the plant as ground truth, name two distinct places in the fitting chain where their setup could have gone wrong, and say which single reported number already told you their answer was broken before you saw the exponent.
