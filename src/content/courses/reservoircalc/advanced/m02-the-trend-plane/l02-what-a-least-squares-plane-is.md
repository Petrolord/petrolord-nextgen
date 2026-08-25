# What a least squares plane is

The trend method fits a plane. This lesson is about what that sentence means computationally, because the properties of the fit are what produce every surprising result in this module.

## The model

A plane over the map is

$$v(x,y) = a + b x + c y$$

with three unknowns. The value at any location is set by an intercept and two gradients, one per map direction. There is no other freedom: no curvature, no local detail, no way for one well to influence its own neighbourhood more than the field as a whole.

## The fit

With six wells and three unknowns the system is overdetermined. There is no plane through all six points unless the six happen to be coplanar, which real data never is.

Least squares picks the plane minimising the sum of squared vertical differences between the plane and the data:

$$\min_{a,b,c} \sum_{i=1}^{6} \left( a + b x_i + c y_i - v_i \right)^2$$

Differentiating with respect to each unknown and setting the derivatives to zero gives three linear equations in three unknowns, the normal equations, which are solved directly. The engine does exactly this: it accumulates the sums of $x$, $y$, $x^2$, $xy$, $y^2$, $v$, $xv$ and $yv$, assembles a three by three system and solves it by Gaussian elimination.

## Three properties that follow

**The residuals sum to zero.** Because the model has an intercept, the fitted plane passes through the centroid of the data. At Ekene the six residuals sum to about $-3 \times 10^{-16}$, which is zero to machine precision.

This has a consequence worth stating: the plane is unbiased over the wells as a set, and can still be wrong at every individual well. Being right on average is not being right anywhere.

**No residual is zero unless by accident.** The fit balances misses against each other rather than eliminating them. An individual well can land close to the plane by luck, as Ekene-1 nearly does, but nothing in the method arranges it.

**Every well influences every node.** Change one well's porosity and all three coefficients move, so the modelled value changes at every node in the frame including nodes on the far side of the field. There is no locality in a plane.

That last property is the sharpest difference from an interpolator, and it cuts both ways. It means an erroneous well value contaminates the whole map rather than a neighbourhood, and it also means the model is stable, since no node can be dragged around by a single nearby measurement.

## Why fit a plane at all

Given those properties, a plane looks like a poor model. It is worth saying why it is often the right one.

With six wells there are six degrees of freedom in the data. A plane spends three of them and leaves three to measure the misfit. A model with more parameters would fit the data better and would be telling you mostly about itself. Kriging with a variogram fitted to six points is a good example: it will honour all six values exactly, which looks impressive and means the residuals are zero by construction, so the data can no longer say anything about whether the model is good.

A plane is also a claim you can argue about geologically. Porosity declining eastward at a stated rate per kilometre is a statement a geologist can accept, reject, or connect to a depositional model. A kriged surface with six bullseyes is much harder to defend or attack.

## Worked example

Fit a plane by hand to three points, to see the machinery on a case small enough to check.

Take wells at (0, 0) with 0.20, (1000, 0) with 0.18, and (0, 1000) with 0.21. Three points and three unknowns, so the plane passes through all three exactly.

From the first point, $a = 0.20$. From the second, $0.20 + 1000 b = 0.18$, so $b = -2 \times 10^{-5}$ per metre. From the third, $0.20 + 1000 c = 0.21$, so $c = 1 \times 10^{-5}$ per metre.

The plane is $v = 0.20 - 2 \times 10^{-5} x + 10^{-5} y$, and porosity falls 0.02 per kilometre eastward and rises 0.01 per kilometre northward.

Now add a fourth well at (1000, 1000) measuring 0.20. The plane above predicts $0.20 - 0.02 + 0.01 = 0.19$ there, so it misses by 0.01. Refitting all four by least squares moves all three coefficients and leaves four non zero residuals summing to zero. The exact fit was an artefact of having exactly as many points as parameters.

## Exercise

State how many wells are needed for a trend fit to have any residuals at all, and explain why a fit with no residuals tells you nothing about the quality of the model.

Self check: four wells, since three non collinear points determine a plane exactly and leave nothing over. With three or fewer the residuals are zero by construction, so they measure only that the arithmetic worked, and any confidence drawn from an apparently perfect fit is unfounded.
