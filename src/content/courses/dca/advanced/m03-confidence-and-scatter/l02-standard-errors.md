# Standard errors

Two functions in `engines/dca/arps.js` produce everything in the interval block: `linearRegressionWithSE`, which fits the linearised model and returns standard errors alongside the slope and intercept, and `computeConfidenceIntervals`, which turns those standard errors into half-widths on $q_i$, $D_i$ and $b$. An Expert reads both before quoting either. This lesson is that read, with the arithmetic done by hand on a table small enough to check.

## What the regression returns

`linearRegressionWithSE` is ordinary least squares on the transformed pair $(x_i, y_i)$, where the transform depends on the family: $y = \ln q$ against $t$ for exponential, $y = 1/q$ for harmonic, $y = q^{-b}$ for a given grid $b$ for hyperbolic. It computes

$$S_{xx} = \sum (x_i - \bar{x})^2, \qquad \mathrm{SSE} = \sum \left(y_i - \hat{y}_i\right)^2, \qquad s^2 = \frac{\mathrm{SSE}}{n - 2}$$

and then the two standard errors

$$\mathrm{SE}(\text{slope}) = \sqrt{\frac{s^2}{S_{xx}}}, \qquad \mathrm{SE}(\text{intercept}) = \sqrt{s^2\left(\frac{1}{n} + \frac{\bar{x}^2}{S_{xx}}\right)}$$

The $n - 2$ denominator is the standard unbiased residual variance for a two-parameter line. Note what enters and what does not: only the transformed residuals, the spread of the time axis, and $n$. No prior, no model comparison, no penalty for having chosen the wrong family.

## Worked example: the Weaver harmonic table

Weaver's continuing-education course P03-004 prints a harmonic example on pages 21 and 22: $q_i = 120$ bbl/d, effective annual decline 0.35, and an eleven-row table of daily rates at half-year steps. The printed rates are 120, 99, 84, 73, 64, 58, 52, 48, 44, 41, 38 bbl/d, rounded to whole barrels.

Take $t$ in days, so the eleven times are 0, 182.5, 365, 547.5, 730, 912.5, 1095, 1277.5, 1460, 1642.5 and 1825. The mean is $\bar{x} = 912.500000000000$, the middle row, because the spacing is uniform. The spread follows in one line:

$$S_{xx} = 2\left(182.5^2 + 365^2 + 547.5^2 + 730^2 + 912.5^2\right) = 3663687.50000000$$

Harmonic means regressing $y = 1/q$ on $t$. The engine gets intercept 0.00833596013224564 and slope 0.00000983371975085758, and the residuals of those eleven points about that line give

$$\mathrm{SSE} = 5.07016742625331\times10^{-8}, \qquad s^2 = \frac{\mathrm{SSE}}{9} = 5.63351936250368\times10^{-9}$$

so

$$\mathrm{SE}(\text{slope}) = \sqrt{\frac{5.63351936250368\times10^{-9}}{3663687.5}} = 3.92130555219451\times10^{-8}$$

and, with $1/n = 1/11$ and $\bar{x}^2/S_{xx} = 912.5^2/3663687.5$, $\mathrm{SE}(\text{intercept}) = 0.0000423377306137669$. Do the slope one on your own calculator now. It is a square root of a ratio, and getting it out by hand is what makes the rest of this module concrete rather than incantatory.

## From standard errors to parameter half-widths

`computeConfidenceIntervals` fixes $t = 1.96$ and propagates by the delta method, one branch per family.

**Exponential.** $\ln q = \ln q_i - D_i t$, so intercept $= \ln q_i$ and slope $= -D_i$. Then $q_i = e^{\text{intercept}}$ gives half-width $q_i \cdot \mathrm{SE}(\text{intercept}) \cdot 1.96$, and $D_i$ inherits the slope error directly as $\mathrm{SE}(\text{slope}) \cdot 1.96$. The $b$ half-width is set to 0, because $b$ is fixed at 0 in this family.

**Harmonic.** $1/q = 1/q_i + (D_i/q_i)t$, so $q_i = 1/\text{intercept}$ and the half-width picks up a factor $q_i^2$. For $D_i = \text{slope} \cdot q_i$ the code writes

$$\Delta D_i = \left(|\text{slope}| \cdot q_i^2 \cdot \mathrm{SE}(\text{intercept}) + q_i \cdot \mathrm{SE}(\text{slope})\right) \cdot 1.96$$

which adds the two contributions in absolute value rather than in quadrature. On the Weaver numbers the two contributions are 0.0000117433016325249 and 0.00000922000436706834, summing to the reported 0.0000209633059995933 where adding in quadrature would give 0.0000149302918176847. The engine's choice is 1.40407878530295 times wider. That is deliberately conservative, and it is not what a textbook variance propagation would print, so do not describe the output as a variance.

**Hyperbolic.** $q^{-b} = q_i^{-b} + b D_i q_i^{-b} t$ for the grid value of $b$. The $q_i$ half-width is $\frac{q_i^{b+1}}{b}\mathrm{SE}(\text{intercept}) \cdot 1.96$. The $D_i$ half-width combines a slope term with a $q_i$ term, and the $q_i$ term is built from `qiHalfWidth`, which already carries its own 1.96, before the whole expression is multiplied by 1.96 again. On the Ikoku table of lesson 3 that qi-borne term is 0.00000993119201855683 of a total 0.0000126354377798578, so 78.5979258620400 percent of the reported $D_i$ half-width carries the factor twice, and the whole half-width is 1.62593544665970 times what a single application would produce. Read that as a property of this implementation, quote it as such, and never present a hyperbolic $D_i$ band as a calibrated 95 percent statement.

**And $b$.** In the hyperbolic branch the code sets `bHalfWidth = b * 0.10` with the comment that $b$ came from the grid search and cannot be given an interval from the regression. It is a hard-coded ten percent placeholder. Lesson 4 is largely about what follows from that.

## Two gates that suppress the block entirely

`computeConfidenceIntervals` returns `{ hasIntervals: false }` when either standard error is not finite or when $n < 5$. Fit Ekene-1's primary window on its first four rows and the block is absent; add the fifth row and it appears, with a $q_i$ half-width of 1.62165554600328e-13. It also returns false when a half-width fails a reasonableness check: $\Delta q_i$ must be below $2 q_i$ and $\Delta D_i$ below $5 D_i$. Those bounds are loose on purpose, and lesson 4 shows how much nonsense passes through them.

## One more honest caveat

The multiplier 1.96 is the normal quantile, not the Student $t$ quantile the residual variance actually calls for at these sample sizes. The exact two-sided 95 percent $t$ value at 9 degrees of freedom, which is the Weaver table, is 2.26215716279792, so the reported interval is 15.4161817754041 percent too narrow. At 10 degrees of freedom it is 2.22813885198615, a shortfall of 13.6805536727629 percent. At 34 degrees of freedom, which is Ekene-1's primary window, it is 2.03224450931766 and the shortfall falls to 3.68594435294176 percent. The approximation is defensible on long histories and misleading on short ones, which is exactly where evaluators most want an interval.

## Exercise

Ahmed's Example 16-2 prints twelve monthly gas rates. Regressing $\ln q$ on time over those twelve rows gives $n = 12$, $S_{xx} = 128700.000000000$ and $\mathrm{SSE} = 0.00000438459476226700$ in a 30-day time unit.

Compute $s^2$ with the $n - 2$ denominator, then $\mathrm{SE}(\text{slope})$, then the $D_i$ half-width the exponential branch would report. Convert it to a per-month figure. Then look up the exact two-sided 95 percent $t$ value for 10 degrees of freedom given above, and state by what percentage the engine's number understates a properly scaled interval. You will check your fitted values against the engine's output in the next lesson.
