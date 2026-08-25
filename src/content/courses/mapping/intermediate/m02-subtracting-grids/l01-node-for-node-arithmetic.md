# Node for node arithmetic

An isochore is one subtraction repeated 500 times. This lesson works through what that subtraction actually does, in what order, and what the sign convention means.

{{panel:mp-isochore-explorer}}

## The operation

Both surfaces are arrays of 500 numbers in the same order: row by row from the frame origin, 25 values per row, 20 rows. The isochore is a third array of 500 numbers where

$$\mathrm{iso}[i] = \mathrm{base}[i] - \mathrm{top}[i]$$

for every index $i$, with one rule for the blanks that the next lesson covers.

There is no interpolation in this step, no smoothing and no fitting. The two surfaces were interpolated when they were gridded; the subtraction is pure arithmetic on the results.

## The sign convention

Depths in this course are **positive downward**, so a deeper horizon carries a larger number. TOP_SAND at Ekene-1 is 1548 and BASE_SAND is 1580, and the base is deeper.

Thickness is therefore **deeper minus shallower**, base minus top, and the result is positive. Doing it the other way round gives a map of negative numbers that contours perfectly well and reads as though the sand had negative thickness everywhere.

The engine names the operation for exactly this reason: its isochore function takes the deep surface first and the shallow surface second, so the order is part of the call rather than something to remember at the keyboard.

## Reading a single node

Take prospect P-1 at (1600, 1600). It is not a well and it is not a node, so both surfaces are sampled there by bilinear interpolation from the four surrounding nodes.

TOP_SAND at P-1 is 1542.619873046875 m, the same number the Associate tier read.

BASE_SAND at P-1 is 1576.669921875 m.

The difference is $1576.669921875 - 1542.619873046875 = 34.050048828125$ m, which is the capstone's thickness at P-1.

That arithmetic can be run in either order with the same result: subtract the two grids and then sample the isochore, or sample both surfaces and then subtract. Bilinear interpolation is linear, so it commutes with subtraction. It is a small thing and it is worth knowing, because it means a thickness quoted at a location does not depend on whether the isochore was built first.

## What the map inherits

Because the isochore is arithmetic on two spline surfaces, it inherits their character rather than having one of its own.

It is **as smooth as its inputs**. Two smooth surfaces subtract into a smooth surface, so a thickness map from spline-gridded picks never shows an abrupt edge unless one of the inputs does.

It is **exact where both inputs are exact**. At a well node where both surfaces honour their picks, the isochore returns the measured thickness with no error at all.

It **cannot be better constrained than its inputs**. Six wells constrain the top and six constrain the base, so the isochore has six control points and not twelve. Two maps of six points do not make a map of twelve.

That last one is the most common misreading of an isochore. The map looks like an independent measurement of thickness because it has its own contours and its own extremes, and it is not. It is a derived quantity with exactly the same control as the two surfaces it came from.

## Worked example

Confirm that the isochore mean is the difference of the two surface means.

TOP_SAND has a map mean of 1550.2667801131063 m and BASE_SAND has 1582.5210707934934 m. The difference is 32.2542906803871 m, and the isochore's own mean is 32.25429068038713 m.

They agree because both means are taken over the same 201 live nodes and averaging is linear: the mean of a difference is the difference of the means whenever the two sets being averaged are the same set.

Note carefully that the same does not hold for the minimum. The base minimum is 1570 and the top minimum is 1539.7181, and their difference of 30.28 m is not the isochore minimum of 25 m, because the two minima occur at different nodes. Only linear operations survive the subtraction.

## Exercise

TOP_SAND at a node reads 1560.4 m and BASE_SAND at the same node reads 1592.1 m. State the isochore value and its sign, then say what the isochore would read if the two surfaces had been subtracted in the other order and why that map would still contour cleanly.

As a self-check: the isochore reads $1592.1 - 1560.4 = 31.7$ m, positive, because depths are positive downward and the base is deeper. Subtracting in the other order gives $-31.7$ m, and the resulting map of negative numbers contours perfectly well because contouring does not care about sign; every value would simply be the negative of the correct one, which is easy to miss if the colour scale is rescaled to fit.
