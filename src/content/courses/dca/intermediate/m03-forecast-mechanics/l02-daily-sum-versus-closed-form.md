# Daily sum versus closed form

The Associate tier established the direction and the size of this gap: the engine's daily sum for Ekene-1 comes back at 91604.1233600709 stb against the closed form's 91666.6666666667 stb, short by 62.5433065957332 stb or 0.0682290617407998 percent, because a right-endpoint sum under a falling rate must understate. That is the fact. The Professional skill is different: separate the gap into its causes, predict each one in a single line of arithmetic, and recognise which cause you are looking at when a number does not reconcile.

## There are two errors, not one

**Discretization.** Each day contributes a rectangle whose height is the rate at the end of the day, and the curve spends the whole day above that height. Every rectangle sits under the curve.

**Truncation.** The sum stops at the last whole day that was produced, day 2070. The closed form runs to the exact crossing at 2070.75554149000 days. Three quarters of a day at about 10 stb/d is missing from the sum and present in the closed form.

Both push the same way, which is why they are so easy to mistake for one effect. Split them by inserting the exact cumulative at the last produced day:

| Quantity | Value (stb) |
|---|---|
| Engine daily sum, days 1 to 2070 | 91604.1233600709 |
| Exact $N_p(2070)$ | 91659.1078256737 |
| Closed-form EUR at the 10 stb/d limit | 91666.6666666667 |

Subtracting down the column gives a discretization term of -54.9844656027271 stb and a truncation term of -7.55884099300602 stb, which together are the full -62.5433065957332 stb. Nearly seven eighths of the gap is the rectangles; the rest is the fractional day the loop cannot represent.

## Predicting each term without summing anything

**The half-drop rule.** Each day's rectangle misses roughly a right triangle whose height is that day's drop in rate. Add the triangles along the whole forecast and the drops telescope into the total drop, so the missing area is about half the total drop times one day:

$$\text{discretization} \approx -\frac{q_i - q(N)}{2}$$

For Ekene-1 that is $-(120 - 10.0090706091916)/2 = -54.9954646954042$ stb against a true -54.9844656027271 stb. One subtraction and one halving, accurate to eleven thousandths of a barrel out of ninety thousand.

**The sliver.** The truncation term is the leftover fraction of a day at roughly the limit rate: $0.75554149 \times 10.0090706091916 = 7.56226812158653$ stb against a true 7.55884099300602 stb.

Neither predictor needs the forecast to be run. If your reconciliation lands within a barrel of these two numbers, the model and parameters agree and only the arithmetic conventions differ. If it does not, something bigger is wrong and you should stop looking at rectangles.

## The percentage is fixed by $D_i$ times the step

Turn off the limit and only the first error survives, and then the exponential case has an exact answer. The daily right-endpoint sum is a geometric series:

$$\sum_{d=1}^{N} q_i e^{-D_i d} = q_i e^{-D_i}\,\frac{1 - e^{-D_i N}}{1 - e^{-D_i}}, \qquad N_p(N) = \frac{q_i}{D_i}\left(1 - e^{-D_i N}\right)$$

Divide one by the other and the $q_i$ and the $(1 - e^{-D_i N})$ both cancel:

$$\frac{\text{sum}}{N_p} = \frac{D_i e^{-D_i}}{1 - e^{-D_i}} = 0.999400120000009$$

The ratio does not contain $N$ and does not contain $q_i$. A no-limit daily sum on Ekene-1 is 0.0599879999991226 percent low at any horizon you like. The engine's ten-year run returns 98688.2275091051 stb against the closed form's 98747.4641378926 stb, which is 0.0599880000004327 percent low: eleven digits of agreement with a formula that never touched the data.

What sits inside that ratio is the product of $D_i$ and the step. Widen the step and the error grows roughly in proportion, which is the entire reason the daily sum is a fourth-decimal nuisance while the monthly snapshot of the next lesson is a booking error.

## Worked example: predict Ekene-3's engine EUR before running it

Ekene-3 is hyperbolic, $q_i = 150$ stb/d, $D_i = 0.002$ per day, $b = 0.5$, closed-form EUR 111270.166537926 stb, crossing at 2872.98334620742 days. The half-drop rule needs only the rate on the last produced day, $q(2872) = 10.0050799125743$ stb/d:

$$-\frac{150 - 10.0050799125743}{2} = -69.9974600437129 \text{ stb}$$

The truth, from $N_p(2872) = 111260.330578512$ stb, is a discretization term of -69.9728907081007 stb. The prediction is high by two and a half hundredths of a barrel on a hundred-thousand-barrel booking, and the rule made no use of $b$ at all.

The truncation term here is -9.83595941342355 stb, larger than Ekene-1's because the crossing at 2872.98 days falls almost at the end of a day, so nearly a whole day is discarded rather than three quarters of one. The engine returns 111190.357687804 stb, a gap of -79.8088501215243 stb or -0.0717252904392174 percent.

Stop and confirm the half-drop prediction yourself. The only quantity you need that is not in the fit is the rate at the last produced day, and you get that from the rate equation.

## Two ways engineers talk themselves into the wrong story

**"The daily sum is more realistic because it steps through time."** Stepping is a numerical method, not a physical claim. The two numbers come from the same model with the same parameters. One evaluates the integral exactly and the other approximates it with rectangles, and the rectangles are not closer to the reservoir for being visible.

**"The gap grows with the length of the forecast."** In barrels it grows, because the volume grows. As a fraction it does not move at all on a no-limit exponential run: the ratio above is 0.999400120000009 whether you run one year or a hundred. If someone reports a percentage discrepancy that grows with horizon, they are looking at a different problem.

## Exercise

Book Ekene-1 at a 20 stb/d limit instead of 10. The closed-form EUR is 83333.3333333333 stb and the crossing is at 1493.13289102338 days. Predict the integer `timeToLimit`, name the last produced day, and use $q(1493) = 20.0031896388790$ stb/d in the half-drop rule to predict the discretization term. Check yourself against the engine's 83280.6868954345 stb, a gap of -52.6464378988458 stb.

Then explain in one sentence why the percentage gap at the 20 stb/d limit, -0.0631757254786147 percent, is smaller than the -0.0682290617407998 percent at the 10 stb/d limit, even though the step is one day in both cases and the well and the fit are identical.
