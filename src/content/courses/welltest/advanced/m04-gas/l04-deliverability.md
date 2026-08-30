# Deliverability

Not a transient at all: a set of stabilised rates, and what the well can do.

{{panel:wt-regression-explorer}}

## A different question

Everything so far has asked what the reservoir is. Deliverability asks what the well will produce against a given pressure, which is what a gas sales contract is written on.

The test is a flow-after-flow, or four-point test: produce the well at several rates, let each one stabilise, and record the stabilised flowing pressure at each.

The classic dataset in this course has three points at an average reservoir pressure of 1952 psia:

| rate (Mscf/d) | flowing pressure (psia) |
|---|---|
| 2624.6 | 1700 |
| 4154.7 | 1500 |
| 5425.1 | 1300 |

## The Rawlins-Schellhardt equation

The empirical form, from 1935 and still in every gas contract:

    q = C ( pr^2 - pwf^2 )^n

with n between 0.5 and 1. The exponent is 1 for fully laminar flow and 0.5 for fully turbulent, and real wells sit between.

The fit is a straight line of log q against log of the pressure-squared difference, and the engine's `backPressureFit` does exactly that, returning n and C and flagging when n falls outside the physical range.

## The Houpeurt or LIT equation

The theoretical form, from the gas flow equation with a turbulence term:

    pr^2 - pwf^2 = a q + b q^2

The first term is Darcy flow, the second is turbulence. Fitting is a straight line of the pressure-squared difference divided by q against q, and `litFit` returns a and b.

This form has the advantage of being derived rather than fitted, and the coefficients have meanings: a contains the permeability and skin, b contains the non-Darcy coefficient.

## Absolute open flow

The number the contract cares about: the rate the well would produce if the flowing pressure were brought to atmospheric.

It is a projection well beyond the tested range, and both methods provide it. The engine takes the base pressure as 14.7 psia and evaluates each fit at the corresponding pressure-squared difference. For the LIT form that means solving a quadratic.

AOF is not a rate anybody produces. Nobody flows a gas well to atmospheric pressure. It is a standardised index of well capacity used for comparing wells and for allocating contract volumes, and its value comes from being computed the same way everywhere.

## Which method

Both are standard, both are accepted, and they disagree. The next lesson is about the disagreement on exactly these three points.

The general guidance: LIT is preferred where the physics matters, because its coefficients mean something and it extrapolates more conservatively. Back-pressure is preferred where continuity with historical practice matters, which in gas contracts is often.

## Isochronal tests

A flow-after-flow test needs each rate to STABILISE, and in a low-permeability gas reservoir stabilisation can take weeks.

The isochronal test gets around it: flow for a fixed short time at each rate, shut in to the initial pressure between rates, and use the fact that the transient at a fixed elapsed time gives the same slope as the stabilised curve. One final extended flow gives the position of the stabilised line.

The engine does not implement isochronal test analysis specifically, and it does not need to: the same two fits apply, to points taken at equal elapsed times.

## The misconception to avoid

"AOF is the well's maximum rate." It is an extrapolation to a pressure the well will never see, through a correlation fitted over a limited rate range, using an equation that ignores wellbore hydraulics entirely. It is an index. Treating it as a deliverable rate overstates what the well can produce, sometimes by a great deal.

## Exercise

For the three points above, compute the pressure-squared difference for each, and confirm they match the values 920304, 1560304 and 2120304.

Then compute what the pressure-squared difference would be at the base pressure of 14.7 psia, which is the quantity both AOFs are evaluated at.
