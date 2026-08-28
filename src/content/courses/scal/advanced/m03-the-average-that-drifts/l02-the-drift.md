# The drift

Run the full pipeline on the three Ekene plugs: J tables from the committed lab rows, normalization with the true $S_{wirr} = 0.25$, the 41-point resample, the geometric mean, the refit. The designed curve underneath is $a = 0.25$, $b = 1$. The refit returns

$$a = 0.2491501585202375, \qquad b = 1.0102893566145976$$

with $r^2_{\log} = 0.9998442671274563$.

Read those three numbers slowly. The fitted $a$ is low by 0.0008498414797624976 absolute, which is 0.33993659190499903 percent. The fitted $b$ is high by 1.0289356614597622 percent. And the fit statistic says the power law describes the mean curve almost perfectly. That last part is the sharpest sentence in this module: the $r^2$ looks perfect while both parameters are biased. A fit statistic measures how well a curve tracks the points it was given. It says nothing about whether the points themselves were bent on the way in.

## The mechanism, exactly

The tabulated evaluator interpolates $\log J$ linearly in $S_w^*$ between nodes. The designed curve is $J = a \, {S_w^*}^{-b}$, so $\log J = \log a - b \log S_w^*$: linear in $\log S_w^*$, not in $S_w^*$. As a function of $S_w^*$, $\log J$ is convex, and a chord drawn under a convex curve lies above it everywhere between its endpoints. So at every off-node grid point, the interpolated J rides high. The nodes are exact; everything between them is inflated.

Watch it happen at the toe. The first two nodes sit at $S_w^* = 0.06666666666666665$ and $0.1333333333333333$, where the measured J values are 3.7500000000000004 and 1.8750000000000002. At the midpoint, $S_w^* = 0.09999999999999998$, the log-linear chord returns the geometric mean of the two node values, 2.6516504294495533. The designed curve there gives 2.5000000000000004. The interpolated point rides high by a factor of 1.0606601717798212: six percent, from interpolation alone, on noise-free data.

Now move up the curve. Between the nodes at $S_w^* = 0.4$ and $0.4666...$, the midpoint at $S_w^* = 0.4333333333333333$ interpolates to 0.5786375623578446 against a true 0.576923076923077, a ride of only 1.0029717747535971. The bias is twenty times smaller. The chord error scales with how hard the curve bends between nodes, and a reciprocal-shaped J bends hardest at the toe, where $S_w^*$ is small and J is climbing toward its asymptote.

So the mean curve handed to the refit is exact at 15 places and systematically high in between, worst at the toe. The refit does the only thing least squares can do with that shape: it steepens. A toe that reads high looks like a faster rise toward the asymptote, so $b$ climbs above 1. And since the curve must still pass near the exact node at $S_w^* = 1$, where $J = a$, the steepening is paid for by pulling $a$ down. One mechanism, two signatures, opposite signs.

{{panel:sc-design-explorer}}

Open the panel and find the averaged-refit tile. It runs this exact pipeline on the three plugs and reports the fitted $a$ beside the design value 0.25. Confirm the tile reads 0.2491501585202375, then compare it against the direct single-plug fit from the previous lesson. Same data underneath, two pipelines, two answers: that pair of tiles is this module in miniature.

## What the capstone does with this

Your capstone grades the field `avg_refit_a` with expected value 0.2491501585202375 and tolerance 0.0005. The design value 0.25 misses by 0.0008498414797624976, which is outside the tolerance by 0.00034984147976249757. That is deliberate. The graded question is not what the designed curve was; it is what THIS pipeline returns, and the two are measurably different. An answer of 0.25 is the right answer to a different question, and the tolerance is set so the grader can tell.

## The misconception to avoid

The misconception is treating a high $r^2$ as proof that the answer is true. Here $r^2_{\log}$ is 0.9998442671274563, about as close to perfect as fits come, and both fitted parameters are wrong in the third digit. The statistic is honest about what it measures: the mean curve really is almost exactly a power law. It just is not quite the power law the rock was built from, because the resample bent the points before the fit ever saw them. Goodness of fit certifies the last step of a pipeline. It cannot certify the steps before it.

## Exercise

First, using the chord argument, predict the sign of the interpolation bias for a J curve that is concave in $\log J$ against $S_w^*$ rather than convex, and state what that would do to the fitted $b$.

Second, the toe midpoint rides high by a factor of 1.0606601717798212 while the fitted $a$ moves by only a third of a percent. Explain in two or three sentences how a six percent local error produces only a sub-percent parameter shift, naming the two features of the pipeline that dilute it.
