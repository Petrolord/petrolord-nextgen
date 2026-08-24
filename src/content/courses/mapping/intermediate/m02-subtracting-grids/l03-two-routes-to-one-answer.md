# Two routes to one answer

There is a second way to build a thickness map, and it looks like a completely different method. This lesson runs both and finds that they give the same answer, then explains why that had to happen.

## The other route

The route used so far grids twice and subtracts:

1. Grid the six TOP_SAND picks into a surface.
2. Grid the six BASE_SAND picks into a surface.
3. Subtract, node by node.

The alternative skips the surfaces entirely:

1. At each well, subtract its own two picks to get a measured thickness: 32, 36, 29, 25, 31 and 34 m.
2. Grid those six thicknesses directly, as if thickness were the thing being mapped.

The second route is simpler, it involves one gridding instead of two, and it feels closer to the data because every control value is a measurement rather than a difference of two interpolations.

## What the model reports

Run both on the capstone settings and compare.

| | Subtraction | Direct gridding |
| --- | --- | --- |
| Minimum | 25 | 25 |
| Maximum | 35.897705078125 | 35.897666931152344 |
| Mean | 32.25429068038713 | 32.25429260671435 |
| At P-1 | 34.050048828125 | 34.0500373840332 |

The largest disagreement anywhere on the map is 0.000110626220703125 m, and the average disagreement is 0.0000393 m. That is a tenth of a millimetre on values of about 32 m.

The two routes are the same calculation.

## Why they must agree

The thin-plate spline is a **linear** interpolator. That word has a precise meaning here and it is the whole explanation.

Fitting a spline to $n$ control points means solving a linear system $A\mathbf{w} = \mathbf{z}$, where the matrix $A$ is built from the distances between control points and depends only on their $(x, y)$ locations. The $z$ values appear only on the right-hand side. Once the weights $\mathbf{w}$ are found, the surface at any location is a fixed set of coefficients dotted with those weights.

Now notice that the top and base surfaces are fitted at the **same six locations**, so both use the identical matrix $A$. If $A\mathbf{w}_{top} = \mathbf{z}_{top}$ and $A\mathbf{w}_{base} = \mathbf{z}_{base}$, then by linearity

$$A(\mathbf{w}_{base} - \mathbf{w}_{top}) = \mathbf{z}_{base} - \mathbf{z}_{top}$$

The weights of the difference are the difference of the weights. Gridding the differences and differencing the grids are the same operation written in a different order, and the disagreement in the table above is floating point rounding rather than method.

## Where the equivalence breaks

Three conditions carry it, and losing any of them loses the result.

**Same control locations.** If a well has a top pick and no base pick, the two systems have different matrices and the routes diverge, sometimes substantially.

**Same method and settings.** A spline for one surface and an inverse-distance interpolator for the other would break it immediately, because inverse distance is not linear in the control values in the same way once the weights are normalised per node.

**Same mask.** The masks are geometric and identical here, but a difference in extrapolation limit between the two runs would leave nodes live in one route and dead in the other.

So the equivalence is a property of a disciplined workflow rather than a law of gridding. It is worth knowing precisely because it is a **test**: if the two routes disagree on your data by more than rounding, something in the workflow is not what you think it is.

## Which route to use anyway

Use subtraction, for a reason that has nothing to do with the numbers.

The subtraction route produces the two depth surfaces as well, and you need them. Volumetrics needs the top surface and a contact. Well planning needs both surfaces. The direct route produces a thickness map and nothing else, so the two depth surfaces have to be gridded anyway, at which point the direct route is extra work that yields a duplicate answer.

## Worked example

A colleague grids thickness directly and reports a maximum of 35.8977 m. You grid by subtraction and get 35.8977 m. A second colleague grids thickness directly on a set where two wells lack base picks and reports a maximum of 34.2 m against your 35.9 m. What is the difference telling you?

The first agreement is expected and confirms both workflows are set up the same way. The second disagreement is not a method dispute: their thickness grid has four control points where yours has six, so it is a less constrained map of the same rock, and their surface simply cannot reach the value that Ekene-2's 36 m pick pulls yours toward.

The right response is to compare control counts before comparing numbers.

## Exercise

State the largest disagreement between the two routes on this dataset, then explain in two sentences why the agreement is a consequence of the spline being linear in the control values.

As a self-check: the largest disagreement is 0.000110626220703125 m, which is floating point rounding rather than a real difference. The spline solves a linear system whose matrix depends only on the control locations, so with both surfaces fitted at the same six wells the matrix is identical, and the weights that fit the difference of the two value sets are exactly the difference of the two weight sets, which makes gridding-then-subtracting and subtracting-then-gridding the same calculation.
