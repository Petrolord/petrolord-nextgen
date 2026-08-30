# The crescent groove

Turning a volume into a depth, and why it is not a division.

{{panel:td-buckling-explorer}}

## The shape

A tool joint of radius r rubbing against the inside of a casing of inner radius R does not cut a rectangular slot. It cuts a groove shaped like the part of the tool joint's circle that lies outside the casing bore: a crescent.

When the wear depth is zero the two circles are tangent and the crescent has zero area. As the joint wears in, the crescent widens as well as deepens.

## The area

    A(d) = pi r^2 - lens( R, r, c )   with   c = R - r + d

where `lens` is the area of intersection of the two circles and c is the distance between their centres.

## Why the depth is not proportional to the volume

Because the crescent's area grows faster than linearly with its depth. A groove twice as deep has more than twice the area.

| wear depth | crescent area |
|---|---|
| 0.0005 m | 0.000012455894202092338 m2 |
| 0.001 m | 0.00003492854768096659 m2 |
| 0.002 m | 0.000097146220392752 m2 |
| 0.003 m | 0.0001755855498047562 m2 |
| 0.006 m | 0.00047427042143805 m2 |
| 0.01 m | 0.000965011628410152 m2 |

Doubling the depth from 0.0005 to 0.001 m multiplies the area by 2.80. From 0.003 to 0.006 m it multiplies by 2.70. Nowhere near 2.

## What that means for the answer

The same wear VOLUME produces less depth than a naive division would suggest, and doubling the volume produces much less than double the depth.

Concretely, on this course's case, doubling the wear factor from 1 to 2 takes the depth from 2.1282387760018993 mm to 3.4259056218767463 mm, a factor of 1.61 rather than 2.

Multiplying it by five takes it to 6.510297887690423 mm, a factor of 3.06 rather than 5.

## The inversion

There is no closed form for depth given area, so the engine bisects: 200 halvings between zero and twice the tool joint radius, converging to 1e-12 m.

Deterministic, and cheap, and worth knowing about because a wear calculation that reports depths to the micron is reporting the output of a bisection rather than a formula.

## Why the nonlinearity is good news

Because wear is self-limiting in depth terms. The first millimetre is the expensive one, and each subsequent one costs progressively more metal.

That is the opposite of the intuition that wear accelerates, and it is why casing that has some wear often survives a great deal more rotation than a linear extrapolation would predict.

## Exercise

Using the table, estimate the crescent area at a wear depth of 0.004 m by interpolation, then compute it exactly from the formula.

Say how large the interpolation error is, and why interpolating on a function this curved is a bad habit.
