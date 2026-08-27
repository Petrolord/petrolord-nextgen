# R-squared and quality

Every fit the engine returns comes with two numbers that judge it, R2 and RMSE, and a one word verdict built from the first of them. Read those three things carelessly and you will defend a fit you should have rejected, or reject one that was fine. This lesson defines them precisely and then shows what they cannot tell you.

{{panel:dca-fit-explorer}}

## The two statistics

Both start from the residuals: for each month in the fitted window, the measured rate minus the rate the fitted model predicts for that month.

**RMSE**, the root mean square error, is the square root of the average squared residual. It comes back in the units of the data, stock tank barrels per day, and it answers a physical question: by how much does this curve typically miss a monthly rate?

**R2** compares the fit against the laziest possible model, a flat line at the mean rate. Write $SSE$ for the sum of squared residuals of your fit, and $SST$ for the sum of squared deviations of the data from its own mean. Then

$$R^2 = 1 - \frac{SSE}{SST}$$

It is dimensionless. At $R^2 = 1$ the fit reproduces every point. At $R^2 = 0$ the fit is no better than quoting the average rate and going home.

One engine detail worth knowing: both statistics are computed on the **original rate scale**, using the predicted rates in stb/d, even though the regression itself happened in log or reciprocal or power space. So the numbers on the tiles mean what you think they mean, in barrels per day. A second detail: the engine clamps R2 at zero, so a fit worse than the flat line reports 0.00 rather than a negative value. If you ever see exactly zero, that is not a coincidence, it is a floor.

## Compute both by hand

Four months of a small well. Measured rates 100, 92, 85 and 78 stb/d; the fitted model predicts 99, 93, 86 and 77.

The residuals are $+1$, $-1$, $-1$, $+1$ stb/d, so

$$SSE = 1 + 1 + 1 + 1 = 4, \qquad RMSE = \sqrt{4/4} = 1.00000000000000 \text{ stb/d}$$

The curve misses by about a barrel a day. Now the mean rate is $(100+92+85+78)/4 = 88.75$ stb/d, and the squared deviations from it are 126.5625, 10.5625, 14.0625 and 115.5625, so

$$SST = 266.75$$

$$R^2 = 1 - \frac{4}{266.75} = 0.985004686035614$$

Stop and notice what just happened. The fit misses by a barrel a day on rates near 90, which is roughly a one percent miss, and R2 reports 0.985. R2 is not a percentage of accuracy. It is the share of the data's own variation that the curve accounts for, and because a declining well varies a great deal all by itself, $SST$ is large and R2 flatters the fit. This is why RMSE travels with it: RMSE knows the answer is one barrel a day, and R2 does not know what a barrel is.

## The quality bands

The engine's `getFitQuality` turns R2 into a tier:

| R2 | Tier |
|---|---|
| $\ge 0.95$ | Excellent |
| $\ge 0.90$ | Good |
| $\ge 0.80$ | Fair |
| below 0.80 | Poor |

The boundaries are inclusive at the bottom of each band: 0.95 is Excellent, and 0.9499 is Good. Two facts about this function matter more than the numbers. It decides the tier from **R2 alone**, so a fit missing by one barrel a day and a fit missing by twenty can carry the same word if their R2 values land in the same band. And it is a display convention, not a standard: no reserves auditor is bound by it, and Excellent is not a synonym for correct.

## What Ekene says, and why you should not learn from it

Fit Ekene-1's primary window with Auto-Select in the panel and read the tiles:

- R2 = 1.00000000000000
- RMSE = 1.42601125915484e-14 stb/d
- Quality: Excellent

That RMSE is fourteen orders of magnitude below the data. The window's mean rate is 67.9983631570361 stb/d, so the typical miss is 2.09712586148817e-14 percent of a typical rate. The other three producers do the same thing on their own windows: Ekene-3 returns RMSE 4.14314051144892e-14, Ekene-5 returns 2.13544491258776e-14, Ekene-6 returns 4.31997628804008e-14, all with R2 = 1.

Real data never does this, and it is important that you feel how unreal it is. The Ekene rates were planted on exact Arps curves so that every number in this course is checkable by hand, and the residual you are looking at is floating point rounding, not geology. On a real well the residuals carry allocation error, downtime, gauge drift and genuine departures from the Arps form, and an honest R2 of 0.97 with an RMSE of a few percent of the mean rate is a good fit, not a disappointing one.

The bands do bite when something is actually wrong. Force a harmonic model onto Ekene-1, an exponential well, over the same window and the engine returns R2 0.872429987742299 with RMSE 9.08390029303620 stb/d, which is 13.3589984689157 percent of the window's mean rate and lands in the Fair tier. That is what a wrong model looks like when the statistics manage to catch it. The next lesson is about the far more dangerous case, where they do not.

## Three misreadings to avoid

**"R2 of 0.95 means 95 percent correct."** It means the curve accounts for 95 percent of the variance around the mean rate. On a steeply declining well that bar is low, because the mean is a terrible model to be compared against.

**"Higher R2, better booking."** R2 measures agreement with the history you fitted. Reserves live in the future, outside the fitted window, where R2 has no vote at all.

**"RMSE is small, so the fit is good."** Small compared with what? RMSE carries units, so it only means something next to the rates. Divide it by the window's mean rate before you call it small.

## Exercise

In the panel, select Ekene-5 with Auto-Select over the primary window and record R2, RMSE and the quality tier. Then work out what RMSE would have to be, as a percentage of that window's mean rate of 63.2567080466940 stb/d, for a miss of one barrel a day. Finally, using the band table and nothing else, state the tier for fits reporting R2 = 0.9500, 0.9012 and 0.7999, and say what extra number you would want to see before signing off on any of them.
