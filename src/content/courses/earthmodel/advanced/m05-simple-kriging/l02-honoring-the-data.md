# Honoring the data

The capstone's tightest-graded field, tolerance 0.0005, asks for the kriged porosity AT well W1, and the answer is W1's own 0.315 to fifteen digits. The field is not testing arithmetic; it is testing whether you know WHY an estimator with a nonzero nugget still returns the data exactly at the data. This lesson derives that why.

## The simple kriging estimate

Simple kriging estimates at a target as the mean plus weighted residuals:

$$\hat\phi(t) = \mu + \sum_i w_i\,(\phi_i - \mu)$$

with the weights solved from the covariance system $A w = c_0$: $A_{ij}$ the covariance between data points $i$ and $j$, and $c_0$ the covariances between each data point and the target. One dense solve per target, four unknowns here, nothing iterative.

## The exactness argument

Put the target ON data point $k$. Then the right-hand side $c_0$ is exactly the $k$-th column of $A$: the target's covariance to each data point IS point $k$'s covariance to each data point, including $C(0) = \mathrm{sill}$ to itself. The system $A w = A_{\cdot k}$ has the immediate solution $w = e_k$, one for point $k$, zero elsewhere, and it is unique because $A$ is nonsingular. The estimate collapses to $\mu + (\phi_k - \mu) = \phi_k$. The engine's krige at (1100, 2100) returns 0.315 with the golden nugget, with nugget zero, with nugget 0.002: ANY valid nugget, always exactly.

Trace where the construction mattered: $C(0)$ was set to the FULL SILL, not sill minus nugget. Had the covariance function been continuous at zero, $C(0) = \mathrm{sill} - \mathrm{nugget}$, the right-hand side at a data point would no longer be a column of $A$, the weights would spread, and the estimate at W1 would slide off 0.315 toward the neighbours. The discontinuity at $h = 0$ is not an accident of implementation; it is the documented "honor the data" choice, and the capstone's 0.0005 tolerance exists to catch every implementation that made the other choice.

## Exactness is a choice, not a law

The other choice is legitimate and has a name: treating the nugget as MEASUREMENT ERROR, where the map should NOT reproduce a noisy observation exactly but smooth through it. Geostatistics textbooks carry both conventions, filtered and unfiltered nugget, and real software packages differ, which is exactly the kind of convention difference that silently moves maps between tools. The engine documents its choice, the fixture pins it, and the capstone grades it; when a map from elsewhere disagrees with this engine AT THE WELLS, the first suspect is this convention, not a bug.

What exactness costs is visible one step off the well, next lesson's subject: honoring a noisy value exactly means the map must jump away from it fast, and the nugget sets how fast.

## Worked example

Confirm exactness numerically the way the test suite does, from three directions at once: krige at W1's exact coordinates with the golden parameters returns 0.31500000000000000; with nugget 0 returns the same; with nugget 0.002, eight times the golden one, the same again. Then step 10 m east, to (1110, 2100), golden nugget: 0.3123130959413633. The estimate moved 0.0027 in ten metres, two orders of magnitude steeper than the trend's gradient over the same step, and that cliff is the price of exactness with a nugget, quantified next lesson.

## Exercise

The system-of-equations argument above used no property of the spherical model. State, in two sentences, whether kriged-at-well exactness survives switching to the exponential model, and what the ONE parameter condition is that the argument required (look at what makes $A$ well-posed and $C(0)$ special).
