# Reading the coefficients

A fitted plane is three numbers, and each is a geological sentence when read correctly, and a trap when read sloppily. This lesson reads $a = 0.38$, $b = -0.00004$ and $c = -0.00001$ the careful way, with the panel showing the consequences.

{{panel:em-population-explorer}}

## The intercept is not a porosity anywhere

$a = 0.38$ is the plane's value at $(0, 0)$, a point 1000 m west and 2000 m south of the model's corner, in rock no well has seen and the frame does not cover. It is a bookkeeping constant, not "the best porosity". No rock in the model carries 0.38: the plane's values ON the frame run from 0.2625 at the southeast corner to 0.32 at the northwest. Reading the intercept as a property of the field is the same class of error as reading a regression's intercept as a data point; the cure, when you want an interpretable constant, is refitting with centred coordinates, where the intercept becomes the value at the centroid.

## The gradients are per metre, and direction-complete

$b = -0.00004$ per metre: eastward travel loses 0.004 of porosity per 100 m. $c = -0.00001$ per metre: northward travel loses 0.001 per 100 m. Combined, the steepest descent direction is mostly east, tilted slightly north: the gradient vector $(b, c)$ has magnitude $\sqrt{b^2 + c^2} = 4.123 \times 10^{-5}$ per metre, azimuth about 14 degrees north of due east. Two wells 500 m apart along that direction should differ by about 0.021 of porosity if the trend is the whole story; on the profile row in the panel, the green trend curve drops visibly east across block 0, 0.002 of porosity per node spacing.

Units discipline does real work here. Coefficients quoted "per metre" versus "per kilometre" differ by a factor of a thousand with identical digits available for confusion, and a porosity gradient is small in any unit, so the sanity check is always a REALISED difference across a known distance: 950 m from W1 to W4 east-and-south predicts $0.38$-plane values 0.315 to 0.2765, a drop of 0.0385, which matches the logged values because the data is planar.

## Coefficients travel badly across blocks

The fit used all four points, three of which are in block 0; the population engine, run per block with the trend method, fits block 0's THREE points alone. Three points, three coefficients: an exactly determined plane, no least squares left, and on this planar fixture the SAME plane, because the fourth point carried no extra information. On real data the per-block and all-well planes differ, sometimes wildly, since removing a well from a four-point fit can swing the gradients: a coefficient is a property of a fit, its data and its domain, and quoting "the field's porosity gradient" without naming which fit produced it is unreviewable. The panel's provenance tile plus the trend tile pin exactly which fit the map used.

## Worked example

Translate the coefficient pair into drilling advice, the way the number actually gets used. A proposed infill location at (1150, 2850), block 1's north where no control exists: the plane says $0.38 - 0.046 - 0.0285 = 0.3055$. The nearest data, W1 at 0.315, sits 752 m to the south-southwest. The trend's claim is therefore: expect about 0.01 LESS porosity than W1, driven mostly by the northward decline. The claim's support: a gradient fitted from four points, all south or east, exactly planar by construction, and, per block 1's own rules, not even applicable across the fault without the borrowing assumption module three flagged. Written that way, the number is usable BECAUSE its pedigree is visible; the panel's trend tile gives the 0.3075 probe the same way, value plus recipe.

## Exercise

Compute the plane's porosity at the four corners of the model frame, confirm the extreme corners and their values, and give the azimuth of steepest ASCENT to the nearest 10 degrees. One line per corner and one for the azimuth.
