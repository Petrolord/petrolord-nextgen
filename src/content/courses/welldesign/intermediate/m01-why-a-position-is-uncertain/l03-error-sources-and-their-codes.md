# Error sources and their codes

Twenty-seven of them, and their names tell you what they are.

{{panel:wd-uncertainty-explorer}}

## The naming scheme

The ISCWSA codes are terse and systematic. Once the scheme is clear the list reads itself.

**First letter: what is wrong.**
D for depth, A for accelerometer, M for magnetometer.

**Second letter: the kind of error.**
B for bias, S for scale factor.

**Then the axes.**
XY for the two cross-axial sensors together, Z for the axial one.

**Then the geometry it applies in.**
TI1S, TI2S, TI3S mark different tool-inclination formulations, used in different parts of the inclination range.

So ABXY-TI1S is an accelerometer bias on the cross-axial pair in the first inclination formulation. MBZ is a magnetometer bias on the axial sensor. ASZ is an accelerometer scale factor on the axial sensor.

## The ones that are not sensors

Several sources describe things outside the tool entirely.

**DECG and DECR** are declination errors: the global one from the field model and a random one. Both rotate the azimuth of the whole well below them.

**DBHG and DBHR** are errors in the assumed horizontal field strength, global and random. They enter the azimuth calculation through the field correction.

**AMIL** is axial magnetic interference: the field the drill string itself adds along the hole axis, which corrupts the axial magnetometer.

**SAG** is bottom hole assembly sag: the tool droops in the hole under its own weight, so the inclination it measures is not the inclination of the hole. This one affects inclination, not azimuth, and so it shows up in the vertical component of the covariance where almost nothing else does.

**XYM1 to XYM4** are cross-axial magnetic interference terms.

**DRFR, DSFS, DSTG** are the depth ones: reference, scale factor and stretch.

## The three that are depth only

The panel flags them. Their weighting functions have a depth component and nothing else, which the engine detects rather than hard-codes: a source is depth-only if every row of its sensitivity has a nonzero depth entry and zero inclination and azimuth entries.

That detection matters because depth errors behave differently: they move the position ALONG the hole rather than across it, so they land in the along-hole component of the borehole frame and contribute almost nothing to the lateral uncertainty that anti-collision cares about.

## Reading the panel

The panel lists every source at the selected station with its share of the total variance, its propagation mode and whether it is depth-only.

Look at the depth-only ones at total depth on the validation well. They are there, they are real, and they are nowhere near the top of the list. The sources that dominate a horizontal well are the azimuth ones, and that is a geometric consequence rather than a statement about which sensors are worst.

## The magnitudes come from the model

Every source has a magnitude in the published parameter set: so many milligravities of accelerometer bias, so many nanotesla of magnetometer bias, so many degrees of declination uncertainty.

Those numbers are the model. A different tool, or a better survey procedure, is a different parameter set, and the industry publishes several: a basic MWD set, sets with in-field referencing, sets with multi-station correction. Choosing which one applies to a given run is a real decision and it changes the answer substantially.

## The misconception to avoid

"The error sources are sensor specifications." Some are, and several are not: declination uncertainty, magnetic interference from the string, and assembly sag are properties of the earth, the drill string and the hole, not of the tool. Improving the tool does nothing for them, which is why the mitigation for the largest one in this course is a different survey PROCEDURE rather than a better instrument.

## Exercise

Open the panel at total depth and write down the top five sources with their shares.

For each, say from its code and this lesson what physically causes it, and whether buying a better MWD tool would reduce it.
