# Reading a crossplot

Two coefficients per interface make a point on a plane. The intercept and gradient crossplot is the standard working display of AVO, and the Ekene pair lands in two very different places on it.

## The two points

| case | $A$ | $B$ |
| --- | --- | --- |
| brine | 0.03434399848203321 | -0.16766246414664518 |
| gas | -0.06282494068620303 | -0.2565633444602355 |

Plotted with $A$ across and $B$ up, the brine point sits in the lower right quadrant, positive intercept and negative gradient. The gas point sits in the lower left, both negative.

The substitution moved the point down and to the left. That direction is the fluid vector for this rock pair, and it is what a real crossplot of a real gather is examined for.

## The background trend

A crossplot of many interfaces from a single well is not a scatter of unrelated points. Shale over brine sand interfaces, shale over shale interfaces and sand over shale interfaces all fall along a trend, because they are all made of the same two or three lithologies in different orders.

That trend is the background, and it is what anomalies are anomalous relative to. A point sitting on the background is an ordinary lithology contrast. A point sitting off it, displaced in the direction the fluid vector points, is a candidate hydrocarbon response.

This is worth stating because it changes what the two numbers are for. The absolute values of $A$ and $B$ matter much less than the displacement from the local background, and the background is a property of the well and the interval rather than of theory.

## Why both coefficients are needed

A stack shows something close to $A$. Two interfaces with the same $A$ and different $B$ look identical on a stack and different on a gather.

At Ekene, imagine a shalier sand with a lower impedance that happened to give $A = -0.0628$ under brine. It would stack identically to the gas case. Its gradient would be quite different, because its shear contrast against the shale would be much smaller, so on a crossplot the two would separate cleanly.

That is the practical argument for AVO in one paragraph: the second coefficient separates cases the first cannot.

## The fluid line and the lithology line

Two directions on the crossplot are usually drawn.

The background or lithology trend runs through the ordinary interfaces, typically with a negative slope, since interfaces with a larger impedance contrast tend to have a larger gradient contrast in the same sense.

The fluid direction is the displacement produced by a substitution, which at Ekene runs down and to the left. Its angle relative to the background is what decides how separable a fluid effect is in a given interval.

Where the two directions are close together, fluid and lithology are confounded and AVO does not discriminate. Where they are close to perpendicular, it discriminates well. That angle is a property of the rocks and it is worth computing for a prospect before promising that AVO will resolve anything.

## Reading it off the panel

The panel plots reflection against angle rather than a crossplot, but the two coefficients are printed and the crossplot is one step away.

{{panel:rp-avo-explorer}}

Read the four coefficient tiles and plot the two points on paper. Then set the threshold control to 0.04 and note that neither coefficient changes: the crossplot position is a property of the rocks, and only the label attached to a region of the plane is a convention.

## Worked example

Compute the fluid displacement and its direction for the Ekene pair.

$$\Delta A = -0.06282494068620303 - 0.03434399848203321 = -0.09716893916823624$$

$$\Delta B = -0.2565633444602355 - (-0.16766246414664518) = -0.08890088031359032$$

The displacement is almost equally split between the two axes, at an angle of $\arctan(0.0889/0.0972) = 42.4$ degrees below the negative $A$ direction.

A displacement that moves both coefficients by similar amounts is the easiest kind to detect, because it is unlikely to lie along a background trend that is dominated by one axis. That is a favourable geometry for this prospect, and it is the sort of statement a rock physics study should make before an AVO interpretation is commissioned.

## Exercise

Two interfaces have the same intercept and gradients of -0.10 and -0.26. State what a stacked section would show and what a gather would show.

Self check: the stacked section would show the same amplitude for both, because a stack is close to the intercept and the intercepts are equal. A gather would show clearly different behaviour with offset, the second brightening about two and a half times faster than the first, so the two would separate on a crossplot along the gradient axis even though they are indistinguishable on the stack.
