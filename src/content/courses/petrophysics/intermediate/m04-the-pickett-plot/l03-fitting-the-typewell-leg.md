# Fitting the typewell water leg

Theory says water-leg samples fall on a straight line in log-log space. This lesson does the fit on the typewell and reads off the two numbers the capstone grades: the cementation exponent $m$ and the product $a R_w$.

## The fitting window and its points

The typewell's water leg spans 2075 to 2078 m. At the well's 0.5 m sampling that window holds 7 samples, but the sample at exactly 2075.0 m carries a null deep resistivity (a common casualty of splicing and edge effects in real data), so 6 points enter the fit. The app drops invalid samples silently and reports the count; always read that count, because a fit through 3 points deserves less trust than a fit through 30.

The six valid points, using neutron-density porosity:

| Depth (m) | $\phi_{ND}$ | $R_t$ (ohm.m) |
| --- | --- | --- |
| 2075.5 | 0.0990 | 5.1015 |
| 2076.0 | 0.0980 | 5.2062 |
| 2076.5 | 0.0970 | 5.3141 |
| 2077.0 | 0.0960 | 5.4253 |
| 2077.5 | 0.0950 | 5.5402 |
| 2078.0 | 0.0940 | 5.6587 |

Porosity falls, resistivity rises, sample by sample. That is the water-leg lockstep from the first lesson, now ready to be quantified.

## Least squares in log space

The app converts each point to $(\log \phi, \log R_t)$ and fits a straight line by ordinary least squares. The slope of that line is $-m$ and the intercept at $\log \phi = 0$ is $\log(a R_w)$. Fitting in log space matters: a least-squares fit on the raw values would weight the high-resistivity end of the line more heavily, and the parameters would drift with the porosity range of the window. In log space every decade counts equally, which is what the power-law form of Archie requires.

For the typewell the fit returns:

$$m = 2.000 \qquad a R_w = 0.0500 \ \text{ohm.m}$$

These are two of the six capstone numbers, graded with tolerances of 0.02 on $m$ and 0.002 ohm.m on $a R_w$. The tolerances are tight because the leg is clean and the fit is essentially exact; on real data you would quote wider uncertainty.

## Worked example: the fit by hand

You can reproduce the fit with two points and a calculator, using the ends of the leg. The slope between (0.0990, 5.1015) and (0.0940, 5.6587) in log space:

1. Logs of the resistivities: $\log 5.6587 = 0.75273$ and $\log 5.1015 = 0.70770$.
2. Logs of the porosities: $\log 0.0940 = -1.02687$ and $\log 0.0990 = -1.00436$.
3. Slope: $(0.75273 - 0.70770)/(-1.02687 - (-1.00436)) = 0.04503 / (-0.02251) = -2.0007$.

The slope is $-m$, so $m = 2.0$ to the precision of the arithmetic. Now the intercept, using either point and the rearranged water-leg equation $a R_w = R_t \, \phi^m$:

1. Take the first point: $\phi = 0.0990$, $R_t = 5.1015$.
2. $\phi^2 = 0.009801$.
3. $a R_w = 5.1015 \times 0.009801 = 0.0500$ ohm.m.

Two points determine the line exactly here because the synthetic leg is noise-free; the least-squares machinery earns its keep on real data, where the six points scatter and the fit averages through them.

## Reading the result

The fitted $a R_w = 0.0500$ ohm.m matches the given $R_w = 0.05$ with $a = 1$, and the fitted $m = 2.0$ matches the given cementation exponent. The typewell's parameter block has now been validated from the well's own data rather than taken on trust. This is the professional habit the module exists to teach: the numbers you inherit are hypotheses, and a water leg is the instrument that tests them.

Notice also what a mismatch would have meant. A fitted $m$ of 1.8 against a given 2.0 would change every Archie saturation in the well; at $\phi = 0.17$ the term $\phi^m$ moves from 0.0289 to 0.0413, dropping computed $S_w$ by about 16 percent relative. Parameter validation is not pedantry; it moves reserves.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-pickett-explorer}}

## Exercise

Fit the line yourself using the two middle points instead of the ends: (0.0970, 5.3141) and (0.0960, 5.4253). Compute the slope in log space and then $a R_w$ from either point. As a self-check: $\log 5.4253 = 0.73441$, $\log 5.3141 = 0.72542$, $\log 0.0960 = -1.01773$, $\log 0.0970 = -1.01323$, so the slope is $0.00899 / (-0.00450) = -1.998$ and $m = 2.0$; then $a R_w = 5.3141 \times 0.0970^2 = 5.3141 \times 0.009409 = 0.0500$ ohm.m. State in one sentence why any pair of points on this leg returns the same answers.
