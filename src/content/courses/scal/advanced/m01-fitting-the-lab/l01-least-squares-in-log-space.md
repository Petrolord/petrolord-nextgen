# Least squares in log space

The Associate tier handed you Corey curves with the exponents already known, and the Professional tier did the same for the J-function until its fourth module. Real laboratories do not hand you exponents. They hand you a table of saturations and measured permeability ratios, and the exponents have to be extracted by a fit. This module is about `fitCoreyToKrTable`, the engine's extraction tool, and the first lesson is about the single most consequential design decision inside it: the residuals it minimizes are not differences of $k_r$ values. They are differences of $\log_{10} k_r$.

## Why the logarithm is not a cosmetic choice

Look at what a Corey curve does across the mobile window. On the Ekene sand the water curve runs from zero at connate up to 0.3 at residual oil, but it does not spend its length evenly. Near the connate end the values sit in the third and fourth decimal place: 0.0006014065304058598 one grid step above connate, 0.0034020690871988564 a step later. Near the far end they sit near 0.3, three orders of magnitude larger.

Now imagine fitting in plain $k_r$ space. A five percent model error at $k_{rw} = 0.3$ contributes a squared residual of about $2 \times 10^{-4}$. A factor of two error, a one hundred percent error, at $k_{rw} = 0.0006$ contributes about $4 \times 10^{-7}$. The fit would happily double the low end of the curve to buy a fraction of a percent at the high end, because the high end owns the arithmetic. The low end is exactly where a waterflood front lives at early time, and exactly where the lab's measurements carry real information about the exponent, so a plain least squares fit optimizes the part of the curve you care least about.

Taking $\log_{10}$ first makes every decade equal. A factor of two mismatch costs $(\log_{10} 2)^2$ wherever it occurs, at 0.0006 or at 0.3. The engine builds one target per usable curve point:

$$r_i = \log_{10}\big(\max(k_{r,\text{model}}, 10^{-12})\big) - \log_{10} k_{r,\text{lab}}$$

and it does this **jointly over both curves**: every usable water point and every usable oil point goes into one residual vector, and one parameter vector must satisfy them all at once. The water curve does not get its own private fit.

## The floor, and why zeros are not data

There is a hole in the plan: the table's endpoint rows contain hard zeros. Water permeability at connate is zero, oil permeability at residual is zero, and $\log_{10} 0$ does not exist. The engine's answer is `krFloor`, default $10^{-4}$: any row whose $k_r$ sits at or below the floor is excluded from that curve's residuals.

This is not discarding information. The endpoint zeros are **definitional**. They are true for every possible exponent, because $S_{wn}^{n_w}$ is zero at $S_{wn} = 0$ no matter what $n_w$ is. A data point that every candidate model reproduces exactly carries no information about which candidate is right, so removing it changes nothing about the answer and everything about whether the arithmetic can run.

The floor also quietly protects you from the lab's own noise. A measured value of $10^{-5}$ on a curve whose neighbours sit at $10^{-1}$ is usually apparatus resolution, not rock physics, and its logarithm would be a residual of enormous leverage. The floor keeps such points out of the vector. If too few points survive the floor, fewer than the parameter count plus two, the engine refuses outright with the message that there are too few usable lab points above the floor to fit. A refusal is an answer: it says the table cannot support the question.

## The kernel underneath

The minimization itself is not new machinery. `fitCoreyToKrTable` calls the same Levenberg-Marquardt kernel, `lib/welltest/lmFit.js`, that the Well Test engines use for pressure-transient matching: bounded parameters, numerically estimated Jacobian, and 95 percent confidence intervals from the curvature at the solution. The exponents are bounded to $[0.5, 8]$, the same physical range the Associate tier's validator enforces on hand-entered parameters, and the starting guess is $n_w = n_o = 2$. One kernel, shared across domains, is the thin-real doctrine applied to numerics: the fitting mathematics is defined in exactly one place.

## The misconception to avoid

The misconception is that log-space fitting is a numerical trick that changes the answer you would honestly get. It is the opposite. Plain least squares on $k_r$ silently reweights the data by its magnitude, handing nearly all the influence to the high-permeability end. The logarithm removes that hidden weighting so that the lab's measurements count by their multiplicative accuracy, which is how a permeability ratio is actually measured. If the two approaches disagree on real data, it is the plain fit that has been distorted.

## Exercise

First, the second grid row of the Ekene lab table reads $k_{rw} = 0.0006014065304058598$ and the row before the residual end reads $k_{rw} = 0.24135141674691027$. Suppose a candidate model overpredicts each by a factor of 1.5. Write down the two contributions to the plain least squares objective and the two contributions to the log-space objective, symbolically or numerically, and state which objective treats the two errors as equally serious.

Second, the table's connate row carries $k_{rw} = 0$ exactly. Explain in two sentences why including a point that every exponent reproduces would leave the fitted $n_w$ unchanged, and why attempting to include it would still break the arithmetic.
