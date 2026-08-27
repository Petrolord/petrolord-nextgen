# Pooling the Ekene hyperbolics

Two hyperbolic wells on the same field, producing from the same sand, both with clean primary declines that the engine fits perfectly on their own. Pool them, fit one curve, and read the answer. It is not the answer anyone predicts, and understanding why is the most valuable thing in this module.

## The run

Normalize each well's primary window separately, flatten the two sets into one cloud of 62 points, and fit a single hyperbolic:

| Parameter | Pooled type curve |
|---|---|
| $q_{i,norm}$ | 1.00042521426751 |
| $D_i$ (1/d) | 0.00131674836694260 |
| $b$ | 0.05 |
| R2 | 0.861590575359367 |

## Read $b$ first

Ekene-3 carries $b = 0.5$. Ekene-6 carries $b = 0.35$. The pooled $b$ is 0.05. It is not between them. It is below both of them, and it is sitting on the bottom rung of the engine's $b$ grid, which module 1 showed you scans in 0.05 steps. A parameter parked on the boundary of its search space is a fit telling you that it wanted to leave the family altogether. At $b = 0.05$ the curve is very nearly exponential, which is to say the best single Arps curve through the union of two hyperbolic clouds is barely curved at all.

Meanwhile $D_i$ does behave the way averaging intuition expects: 0.00131674836694260 sits comfortably between 0.001 and 0.002. That coincidence is what makes the $b$ result so easy to miss in a review. One parameter blends, and the parameter that controls the entire tail does the opposite of blending.

## Where the curve actually sits

Evaluate the pooled curve against both members at the same normalized times:

| $t$ (days) | Pooled curve | Ekene-3 | Ekene-6 |
|---|---|---|---|
| 365 | 0.622193474329974 | 0.536703833407130 | 0.709284499865980 |
| 730 | 0.391246805916200 | 0.334124093688396 | 0.521995215920740 |

The pooled curve reads 15.9286436208465 percent above Ekene-3 at one year and 17.0962565426594 percent above it at two, while reading 12.2787154593767 percent below Ekene-6 at one year and 25.0478176842895 percent below it at two. It threads between the two members, and the threading gets worse with time, because the members themselves diverge with time.

## The R2 that hides all of that

The pooled fit reports R2 0.861590575359367 across all 62 points. Take that same curve and score it against each member separately:

| Member | R2 of the pooled curve | RMSE (fraction of peak) | Largest deviation |
|---|---|---|---|
| Ekene-3 | 0.909718698071357 | 0.0638681279989986 | -0.0856048910052220 |
| Ekene-6 | 0.615735522363384 | 0.0944754909644615 | +0.136846427342102 |

The headline statistic is a weighted blend that conceals an R2 of 0.62 on one of the two wells the curve claims to represent. Whenever you fit across a group, recompute the statistic member by member. A pooled R2 answers the question "does this curve describe the cloud". It never answers "does this curve describe my well", and the second question is the one a booking depends on.

Part of the blending is just arithmetic: 34 of the 62 points are Ekene-3's, 54.8387096774194 percent of the cloud, and Ekene-3's window is longer. All 7 pooled points beyond $t = 821$ days belong to Ekene-3 alone. So the far end of a pooled type curve is set by whichever wells happened to live longest, and the far end is exactly where an extrapolated booking spends its barrels.

## The quality label disagrees with itself

Same fit, two functions in the same engine. `getFitQuality` reads bands on R2 (0.95 and above Excellent, 0.90 and above Good, 0.80 and above Fair) and returns **Fair** for 0.861590575359367. `calculateTypeCurveQuality` asks for R2 above 0.85 with more than 20 points and returns **Good** for the same number. Both are shipped, both are correct implementations of their own rule, and they disagree about the same curve. Read the R2 and the per-member residuals. The word is a convenience for a dashboard tile.

{{panel:dca-typecurve-explorer}}

The panel opens with Ekene-3 and Ekene-6 checked, which is exactly the pool above. Read the $q_{i,norm}$, $D_i$, $b$ and R2 tiles and confirm all four values before going on.

## Worked example: evaluate the pooled curve by hand

The pooled curve is a hyperbolic with $b = 0.05$, so its exponent is $1/b = 20$. At one year:

$$b D_i t = 0.05 \times 0.00131674836694260 \times 365 = 0.0240306576967024$$

$$(1.02403065769670)^{20} = 1.60790052538697$$

$$q_{norm}(365) = \frac{1.00042521426751}{1.60790052538697} = 0.622193474329974$$

Run the same chain at $t = 730$ days: the product is 0.0480613153934048, the power is 2.55701822772654, and the curve reads 0.391246805916200. Do both on a calculator now and then read them against the member values in the table above. Seeing the pooled number land between two numbers it matches neither of is more convincing than being told.

## Exercise

On the panel, uncheck Ekene-6 so the pool is Ekene-3 alone and read $b$ and R2. Then do the reverse, Ekene-6 alone. You should find each well recovering its own planted exponent at R2 1.00000000000000.

State in one sentence what those two runs prove about where the collapse to $b = 0.05$ comes from, given that the fitter and the normalization are identical in all three runs. Then predict, before clicking, whether adding Ekene-1 to the pair would push the pooled $b$ up or down, and check yourself on the panel.
