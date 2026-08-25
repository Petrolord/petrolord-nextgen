# Why the lever is so long

A six percent trend error became a doubling of the answer. This lesson takes the amplification apart into its three stages, because once you can name the stages you can estimate the damage of any proposed trend before running anything, which is the difference between reviewing a prognosis and merely rerunning it.

## Stage one: the trend error becomes a ratio error, one for one

The ratio is trend over log. Perturb the trend by a fraction $\epsilon$, leave the log alone, and the ratio moves by the same fraction: a trend 6.65 percent low at 3000 m makes the ratio 6.65 percent low. No amplification yet, but no attenuation either, and crucially no cancellation: the error has the same sign at every depth, because the trend disagreement is an exponential curve, not noise.

Compare the log's position. A log error at one sample moves one ratio; a trend error moves all 401 in formation. That is stage one's real content: the trend error enters as a coherent field, not a scatter.

## Stage two: the exponent multiplies by n

For ratios near 1, $(r(1-\epsilon))^n \approx r^n (1 - n\epsilon)$: the handover fraction gains roughly $n$ times the ratio error. At $n = 3$, the 6.65 percent becomes about 20 percent of extra handover at 3000 m. This is the same tripling that makes the method sensitive enough to see a four percent slowness as 6 MPa; sensitivity to signal and sensitivity to error are the same number. A method that amplified evidence without amplifying mistakes would be a perpetual motion machine of inference; Eaton is honest about the price.

Note what the stage does to the choice of exponent on a real well: a higher calibrated $n$ buys sensitivity and pays for it in trend-error gain, one of the trades behind the Expert tier's calibration lesson.

## Stage three: the budget converts percent to megapascals

The handover error is a fraction of $S - P_h$, which grows from nothing at the mudline to 49.7 MPa at TD. The same fractional error is worth ten times more at depth than at 500 m. This stage is why the phantom pressure grew downward through the last lesson's tiles even as the proportional trend gap was narrowing: percentages were falling, but the budget behind them was climbing faster, until the two trades peaked the error at 3640 m.

The three stages compose into a usable estimate:

$$\Delta OP(z) \approx n \, \epsilon(z) \, (S(z) - P_h(z))$$

where $\epsilon(z)$ is the proportional trend error. Check it at 3000 m: $3 \times 0.0665 \times 35.523 = 7.09$ MPa, against the exact phantom of 6.25. At 2500 m: $\epsilon = 22.56 / 317.28 = 0.0711$, and the budget there is 28.695284014679014 MPa, so $3 \times 0.0711 \times 28.70 \approx 6.1$ against an exact 5.70. The estimate runs ten to fifteen percent hot because the linearisation overstates the cube for departures this large, and that is fine: it is a screening tool, and it screens in thirty seconds.

## The lever in reverse: what precision the trend must hold

Turn the estimate around to answer the practical question: how good must a trend be for pressures good to 1 MPa at depth? At TD, $\Delta OP = 1$ MPa needs $\epsilon = 1 / (3 \times 49.7) = 0.0067$: two thirds of one percent, which on a trend of 259.55 us/m is 1.7 us/m. On this well, whose trends disagree by 13.4 us/m at TD, the trend uncertainty dominates the answer by a factor of eight.

That is the honest headline of the whole module. In compaction-based pressure prediction, the trend is usually the largest term in the error budget, larger than log quality, larger than the density column, larger than anything except the exponent on an uncalibrated well. Effort allocated anywhere else first is effort misallocated.

## Worked example

A colleague proposes shifting the trend mudline value down by 10 us/m to better honour a cluster of shallow picks, keeping the decay constant. Estimate the cost at TD before anyone reruns anything. A 10 us/m shift at the mudline decays with the trend's exponential: at TD the shift is $10 \times e^{-2.4} = 0.9071795328941251$ us/m, so $\epsilon = 0.907 / 259.55 = 0.0035$. Damage: $3 \times 0.0035 \times 49.71 = 0.52$ MPa at TD. Small, because a mudline-only shift dies with depth. Now the same 10 us/m moved instead into the decay constant, which is what fitting to shallow picks usually does, and which does NOT die with depth: that is this module's fitted trend, and it cost 6 MPa. WHERE a trend error lives matters more than its size at the surface.

## Exercise

Using the three-stage estimate, predict the phantom overpressure at 1000 m under the fitted trend, given $\epsilon(1000) = 25.75 / 459.28 = 0.0561$ and a budget there of 9.994366697406962 MPa. Compare with the engine's 1.5885506433234309 MPa and comment on the gap.

Self check: $3 \times 0.0561 \times 9.9944 = 1.682$ MPa, against the exact 1.589. The estimate runs six percent hot, consistent with the ten to fifteen percent seen deeper: the linearisation always overstates, because the true cube of a number below one falls short of the straight line. The estimate degrades as $\epsilon$ grows, which is precisely when you should already have stopped trusting the trend rather than the estimate of its damage.
