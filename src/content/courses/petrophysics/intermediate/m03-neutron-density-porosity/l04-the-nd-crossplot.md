# The neutron-density crossplot

The last two lessons treated neutron-density disagreement depth by depth. The crossplot displays every depth at once, turns tool disagreement into position on a chart, and lets lithology, porosity, shale and gas each claim a recognisable neighbourhood. It is the standard first picture a professional makes when opening an unfamiliar well.

## Building the plot

Each depth sample becomes one point. The neutron reading NPHI goes on the x axis; the y axis carries the density measurement, either RHOB directly or the density porosity computed from it. The app plots the pair for every sample in the display window and overlays three matrix lines: Sandstone, Limestone and Dolomite. Those are exactly the three lithology lines the app draws, each one the locus of clean, water-filled rock of that mineralogy from zero porosity up.

The lines are graduated in porosity. Zero porosity sits at the matrix point (for sandstone, bulk density 2.65 and neutron near zero on a sandstone scale), and the line runs toward the 100 percent water point as porosity rises. A point sitting exactly on a matrix line is telling you two things at once: its lithology is that mineral, and its porosity is wherever along the line it sits.

## Reading positions

The power of the crossplot is that departures from the lines are directional, and each direction has a meaning you already know from the previous lesson.

* On the sandstone line: clean, water- or oil-filled sandstone; read porosity straight off the line graduation.
* Pulled toward high NPHI and low density porosity, the lower right region of the plot as the app draws it: shale. Clay-bound hydrogen drags the neutron right while the clay grain density holds the density porosity down.
* Pulled the opposite way, toward low NPHI with high density porosity: gas. Both tools are being fooled in their characteristic directions at once.
* Between the limestone and dolomite lines: either a mixed carbonate lithology or a calibration question; in a clastic section like the typewell, points there deserve suspicion rather than a lithology call.

The plot does not distinguish oil from water. Both are hydrogen-rich liquids of broadly similar density, so liquid-filled points plot in nearly the same place regardless of which liquid fills the pores. Fluid typing on this chart is a gas-versus-liquid question only.

## The typewell on the crossplot

Plot the typewell samples and the section sorts itself into two clouds.

The clean SAND_A points gather near the sandstone line at apparent porosities spanning roughly 0.13 to 0.21. The mid-zone sample at 2020 m plots at NPHI 0.13 with density porosity 0.2100: close to the sandstone line but not on it, with the neutron on the low side, the same modest disagreement the average from lesson l02 splits into the booked 0.1700. The water-leg points near 2076 m sit tighter to the line, where NPHI 0.098 and density porosity 0.0980 agree almost exactly.

The shale points are unmistakable. The 2000 m sample plots at NPHI 0.30 with density porosity 0.0606: far off every matrix line, deep in the high-NPHI corner, exactly where the shale-effect arithmetic of the previous lesson predicted. Nothing else in the section reaches that region, so a polygon drawn around it isolates shale samples cleanly, which is precisely how crossplot-based facies flags work in the app.

There is no cloud in the gas quadrant. The oil and water column of the typewell leaves that region empty, matching the absence of crossover noted in lesson l03.

## What the crossplot is for

Be clear about the tool's role: the crossplot is a quality check and a reconnaissance picture, not a replacement for the porosity calculation. The numbers the course books still come from the average of lesson l02, computed depth by depth. What the crossplot validates is the assumptions underneath that arithmetic: that the matrix values chosen (2.65 g/cc, sandstone neutron scale) are consistent with where the clean points actually plot; that shale contamination is confined to identifiable intervals; and that no gas effect is silently inflating the density porosity. If the clean cloud sat systematically off the sandstone line, the professional's first move would be to question the matrix parameters, not to force the points to fit.

Used that way, five minutes on a crossplot buys confidence in every downstream number, because the porosity model has been visually confronted with all of the data at once instead of one depth at a time.

## Exercise

Sketch, or describe precisely, where each of these three samples plots relative to the sandstone line, and name the effect: (a) NPHI 0.13, density porosity 0.2100; (b) NPHI 0.30, density porosity 0.0606; (c) NPHI 0.098, density porosity 0.0980. As a self-check: (a) near the line with the neutron reading low, a clean sand with modest tool disagreement; (b) far into the high-NPHI corner, the shale signature; (c) essentially on the line, the clean water-leg sand where both tools agree. Finally, state in one sentence what it would mean if a fourth sample plotted at NPHI 0.05 with density porosity 0.25.
