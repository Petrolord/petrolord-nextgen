# What a table does between its rows

A table has 22 rows. A simulator asks about saturations that are not any of those 22. What happens in between is a modelling decision the deck makes silently, and it is worth knowing which one.

## Linear interpolation

Between two rows, a simulator interpolates linearly. That is the rule for relative permeability, for capillary pressure, and for the PVT tables.

So a table is not a curve. It is a polyline through the points you supplied, and the curve you meant only exists at the rows.

## What that costs

The Ekene SWOF has 22 rows across a mobile range of 0.4 saturation units, so the spacing is about 0.02. Over that spacing a Corey curve with an exponent of 2.5 is very nearly straight, and the interpolation error is small.

Make the table coarse and it stops being small. Five rows across the same range gives a spacing of 0.1, and a chord across 0.1 of a convex curve sits noticeably above it. The direction is predictable: linear interpolation of a convex function OVERESTIMATES between the nodes. A coarse water curve reads more mobile than the model intends, everywhere except at the rows.

That is the same effect the SCAL course found when it resampled J-curves through a log-linear evaluator, and the direction is the same for the same reason.

## Where to put the rows

Not uniformly, if the curve is not uniformly curved. Rel-perm curves bend most near the endpoints, so rows should be closer together there and can be sparser in the middle.

The Ekene table uses uniform spacing, which is simple and adequate at 22 rows. A five-row table would need its rows concentrated near connate water and residual oil to be defensible at all.

## The PVT tables have the same property

PVTO has three saturated nodes at 1000, 1500 and 2000 psia. Between them the simulator interpolates linearly in pressure. Ekene's saturated branch was designed to be linear in pressure, so the interpolation is exact there, which is a property of this teaching fixture rather than of oil.

Real saturated Bo curves bend, and a three-node table on a real fluid would carry real interpolation error between 1000 and 1500 psia. The Material Balance course made the same point about interpolating formation volume factors: the interpolation was exact because the underlying line was straight, and the reason is worth knowing so you do not expect exactness elsewhere.

## Outside the range

Held flat, not extrapolated. The last row's value applies to everything beyond it, in every one of these tables.

That makes the ends of a table a silent trap. A pressure below the lowest PVT row gets the lowest row's properties, and the properties stop changing at exactly the pressure where they would be changing fastest. The check is to confirm that your run's pressure range sits INSIDE your table's range, and that check is one line of arithmetic that almost nobody does.

## The practical rule

Two questions for any table you inherit:

1. Does its range cover everything the run will ask for?
2. Is it fine enough that a chord between rows is close to the curve you meant?

If you cannot answer the second, plot the table against the model it came from. The gaps show up immediately and they show up in one direction.

## The misconception to avoid

"More rows is always better." More rows is better up to the point where the interpolation error falls below everything else you are uncertain about, and past that it is decoration. A 200-row rel-perm table fitted to a Corey model with two exponents contains exactly two numbers of information and 200 rows of arithmetic.

## Exercise

First, the Ekene SWOF row spacing is about 0.02 in saturation. State whether linear interpolation would over or underestimate a convex water curve between two rows, and why.

Second, the PVDG table runs from 400 to 3800 psia. State what the simulator would use for a cell at 200 psia, and describe the check that would have caught it.
