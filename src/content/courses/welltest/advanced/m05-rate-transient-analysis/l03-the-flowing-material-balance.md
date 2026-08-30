# The flowing material balance

Oil in place from production data, and the two things it depends on that are not in the data.

{{panel:wt-regression-explorer}}

## What the engine does

`flowingMaterialBalanceOil` takes the rows with material-balance time already computed, the initial pressure and the total compressibility. It filters to points where te is positive and the drawdown is positive, regresses (pi - pwf)/q against te, and refuses to return anything if the slope or the intercept comes out non-positive.

That refusal is worth noticing. A negative slope would give a negative oil in place and a negative intercept a negative productivity index, and both are signs that the data are not boundary-dominated. Returning null rather than a negative number is the right behaviour and it is the kind of thing a course should point at.

## The result on the fixture

A sixth of a percent below the planted 2 million stock tank barrels, and a fifth of a percent below the planted productivity index, at an r squared indistinguishable from 1 over 80 points.

By the standards of everything else in this course that is an excellent recovery. Compare it against the permeability from a semilog line, which was three percent low at its best.

The reason is the same as the closed rectangle's in the Professional tier: this is a material balance, not an extrapolation. Boundary-dominated flow is an equilibrium and the relationship is an identity.

## The two external dependencies

**Total compressibility**, which multiplies the answer directly.

**The initial pressure**, which sets the drawdown at every point. An initial pressure 100 psi too high inflates every (pi - pwf) by 100, which raises the intercept and lowers the apparent slope, giving a larger N and a smaller J.

Neither is in the production data. Both come from elsewhere, and both should be in the report next to the answer.

## What N actually is

The hydrocarbon volume CONNECTED to this well under the conditions of the record. Not the field, not the block, not the volumetric estimate.

Three consequences.

**It is a per-well quantity.** Summing N over the wells of a field is not the field's oil in place, because drainage volumes overlap and because unswept regions belong to nobody.

**It changes.** Drill an infill well and the original well's N falls. Shut in a neighbour and it rises.

**It is a lower bound on what is there and an upper bound on what this well will produce.** Connected does not mean recoverable.

## Comparing with volumetrics

The comparison is worth making for the same reason as the drainage area comparison.

An N well below the volumetric estimate says the well is connected to less than the map gives it: compartmentalisation, poor vertical connectivity, or a stimulated volume smaller than designed.

An N above it says the map is conservative, or the compressibility is wrong, or the record is not yet boundary-dominated and the fit has caught the transient.

The last of those is the commonest error and it always produces an N that is too LARGE, because transient data have a shallower slope than the depletion line.

## The productivity index

The intercept's answer, and the one that gets used most in practice.

J is the rate the well delivers per psi of drawdown from the average reservoir pressure. It is what an inflow performance curve is built from, and it degrades over time as the skin grows or the relative permeability to oil falls.

Tracking J from production data, month by month, is one of the most useful things a production engineer can do, and it needs no test at all.

## The misconception to avoid

"Rate transient analysis measures oil in place." It measures a pore volume times a compressibility, expressed as a hydrocarbon volume through assumptions about saturation and formation volume factor, over the region connected to one well during one period. Each of those qualifiers is a real restriction, and the number is far more useful when they are stated than when it is reported as though it were a reserve.

## Exercise

The engine refuses to return a result if the fitted slope or intercept is non-positive.

Describe a physical situation that would produce a negative intercept, and one that would produce a negative slope. Then say what a caller should do in each case, given that the function returns null and says nothing.
