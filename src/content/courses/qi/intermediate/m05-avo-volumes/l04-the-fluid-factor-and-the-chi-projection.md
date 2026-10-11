# The fluid factor and the chi projection

Intercept and gradient are two numbers at every sample; a map wants one. The fluid factor of Smith and Gidlow (1987) and the chi projection of Whitcombe and others (2002) are two ways to combine A and B into a single attribute that separates fluid from the background. `contrastsFromAB` gives the first and `chiProjection` the second.

## The fluid factor

`contrastsFromAB` turns A and B back into relative contrasts across the interface: dVp/Vp, dVs/Vs and drho/rho. It needs two stated pieces to do it. A stated Vs/Vp sets how the gradient divides between compressional and shear contrast, and Gardner's density, drho/rho = dVp/Vp / 4, ties the density contrast to the velocity contrast. From those, the fluid factor is

dVp/Vp - 1.16 (Vs/Vp) dVs/Vs

which sits near zero along the mudrock line, where compressional and shear velocity rise together. A pore fluid moves Vp without moving Vs much, so a fluid contrast moves the factor away from zero.

The engine needs A and B as reflection coefficients. The top of gather 5's two-term A and B, divided by the one scale over every well (1882.216944), at a stated Vs/Vp of 0.500000:

| quantity | value |
| --- | --- |
| dVp/Vp | 0.426623 |
| dVs/Vs | 0.550179 |
| drho/rho | 0.106656 |
| fluid factor | 0.107520 |

drho/rho is a quarter of dVp/Vp, as Gardner's relation sets it. The factor is positive at the top. Every figure in the table moves with the stated Vs/Vp and with the scale, so a fluid factor map is quoted with both.

## The chi projection

`chiProjection` rotates the crossplot: A cos(chi) + B sin(chi), at a stated angle chi. Each chi gives a different attribute from the same A and B. At the top of gather 5, in trace amplitude units:

| chi, degrees | projection |
| --- | --- |
| 30 (stated) | 67.419446 |
| atan(m) = -76.033690 | 833.848276 |

The second row uses the background trend slope m -4.020851 of the last lesson: at chi = atan(m) the projection reads the point's position along the background trend. A chi set at right angles to the trend would read across it, which is the off-trend direction. In between, each chi weights intercept and gradient differently, so the chi is a choice a study states beside every map it reads.

## What both attributes rest on

The two attributes are rearrangements of the same A and B, so they carry every choice under the fit, and each adds its own: the fluid factor a stated Vs/Vp, Gardner's density and the scale, the chi projection a stated angle. Neither is a measurement of fluid on its own. Each says where a sample sits against a stated line, and the AVO at the wells module checks the seismic points against modelled ones before any attribute is read for fluid.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the AVO view on the Ekene pack's gather 5 with two terms at 10, 20 and 30 degrees and the time at 1292 ms. Enter the scale 1882.216944 and a Vs/Vp of 0.5 and read the three contrasts and the fluid factor. Change the Vs/Vp control and record which contrast moves and which stays. Then set chi to 30 degrees and to the angle of the background trend, read both projections, and sweep chi to find where the top's projection crosses zero.
