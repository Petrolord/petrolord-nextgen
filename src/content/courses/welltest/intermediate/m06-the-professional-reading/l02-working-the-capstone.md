# Working the capstone

Six numbers from four different tests, and the settings that make them reproducible.

{{panel:wt-diagnostic-explorer}}

## What is asked

The Professional capstone is a diagnostic exercise across four fixtures rather than one analysis of one test. It asks for:

1. the radial derivative plateau on the BUILDUP;
2. the permeability from the LATE semilog line on the sealing-fault test;
3. the ratio of the late slope to the early slope on that same test;
4. the sqrt-time slope on the FRACTURED well;
5. the drainage area from the CLOSED RECTANGLE;
6. the dip ratio on the DUAL POROSITY test.

Every one of them is an engine output at stated settings, and every setting is stated because these quantities depend on them.

## The settings that matter

**The derivative smoothing is L = 0.1**, the default, everywhere.

**The buildup is differentiated against Agarwal equivalent time**, not against shut-in time, and the pressure change is the fixture's own dp. The plateau is the arithmetic MEAN of the derivative over the points whose equivalent time is 5 hours or more. There are twelve of them.

**The fault windows are 1 to 20 hours for the early line and 200 to 1000 hours for the late line**, both MDH analyses on the flowing pressure.

**The fracture sqrt-time window is 0.1 to 10 hours.**

**The rectangle's Cartesian window is 500 hours and later**, and the area is the pore volume divided by porosity times net pay, in square feet.

**The dual-porosity dip is the minimum derivative between 0.05 and 50 hours**, and the late plateau is the mean derivative from 300 hours on. The dip ratio is the first divided by the second.

## Why the settings are stated

Because these are not settings-independent quantities and pretending otherwise would make the capstone unanswerable.

The plateau depends on the window it is averaged over. The dip ratio depends on L, as module 1's sweep showed. The fault slope ratio depends on where you draw the two lines. The sqrt-time slope depends on the window strongly, as module 4's discussion of the half-length error made clear.

In practice you choose these from the derivative plot and defend the choice. Here they are given so that everybody's six numbers are the same six numbers.

## The order to work in

Start with the plateau, because it is the one that connects back to the Associate tier: it is the same buildup, differentiated instead of fitted, and its height should imply a permeability close to the one you reported at the previous tier.

Then do the fault pair together. Compute both lines, report the late permeability and the slope RATIO. The ratio is dimensionless and it is the evidence for the boundary; the late permeability is what a careless analyst would have reported as the answer.

Then the fracture slope, which is a Cartesian least squares of pressure change against the square root of time in hours, over 17 points.

Then the rectangle, which needs the Cartesian pressure-against-time fit, the pore volume equation, and one division.

Then the dip ratio, which needs the derivative on the dual-porosity fixture and two selections from it.

## What to notice while you work

The fault's late permeability is a bit over half of the early line's 81.25445414895721 mD, and the slope ratio is well short of 2. Both are the asymptotic doubling not having finished.

The rectangle's area comes out within a few thousandths of a percent of the planted 2,800,000 square feet, which is the best agreement anywhere in this course. Compare that against every other number you have produced.

The dip ratio comes out around a quarter, against an omega of 0.08. Those are different quantities and the gap between them is module 5's point.

## Precision

Full precision, tight tolerances, for the same reason as the previous tier: the grader is checking that you ran the analysis at the stated settings rather than estimating from a plot.

The area tolerance is 50 square feet on 2.8 million, which is about two parts in a hundred thousand. Reporting the planted 2,800,000 will fail, correctly, because the recovered value is not the planted one.

## Exercise

Before opening the panel, write down for each of the six fields which engine function produces it and what its inputs are.

Then open the panel and produce the six. Any field whose function you could not name beforehand is one to go back to.
