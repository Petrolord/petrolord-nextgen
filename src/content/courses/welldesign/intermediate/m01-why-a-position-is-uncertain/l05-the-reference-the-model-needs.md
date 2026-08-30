# The reference the model needs

Two numbers without which the error model refuses to run.

## The refusal

The engine's error model checks its header before doing anything, and throws if the total magnetic field strength or the dip angle is missing, with a message naming both and saying where they come from.

That refusal is deliberate and it is worth understanding, because it looks like an inconvenience and is not.

## Why the field strength matters

The azimuth from a magnetic survey is derived by resolving the measured field against the tool's idea of down. How ACCURATELY that can be done depends on how large the horizontal component of the field is, because the azimuth is essentially the direction of that horizontal component.

A magnetometer bias of a given size in nanotesla is a large angular error where the horizontal field is weak and a small one where it is strong. So the weighting function for every magnetometer source has the total field and the dip in it.

Without those two numbers the model cannot convert a sensor error into an azimuth error at all.

## Why the dip matters

Dip is the angle of the field below horizontal. At the magnetic equator it is zero and the field is all horizontal; near the poles it approaches ninety degrees and the horizontal component nearly vanishes.

High dip is bad for magnetic surveying, and it is bad in a direction-dependent way: a hole drilled along the horizontal field direction is much worse determined than one drilled across it.

The validation well in this course has a dip of 72 degrees, which is high, and its azimuth-related sources dominate accordingly.

## Where the two numbers come from

Three sources, in decreasing order of quality:

**An in-field reference.** A magnetometer station on the surface near the rig, recording the field continuously during the well. Best, because it captures the daily variation and any local anomaly.

**A geomagnetic model.** The world magnetic model or a high-resolution equivalent, evaluated at the well's position and date. Good, and it is what the Expert tier checks against NOAA's own test values.

**A survey provider's report.** Which is one of the first two, passed through.

The choice matters: an in-field reference supports a smaller declination uncertainty in the parameter set, which reduces the largest error sources in the budget.

## The header the model wants

The validation well's header, which the panel prints, is the complete list:

- total field strength in nanotesla;
- dip angle in degrees;
- declination in degrees;
- grid convergence in degrees;
- which north the azimuths are referenced to;
- the inclination below which the vertical formulation is used;
- the value of gravity.

Seven numbers, of which four describe the earth at that place and time.

## The vertical limit

The last of the seven deserves a note. Near vertical, azimuth is poorly defined and several weighting functions divide by the sine of the inclination, which goes to zero.

The model has an explicit inclination threshold below which it switches to a formulation that does not blow up. The validation well sets it very small, a ten-thousandth of a degree, because its first stations are exactly vertical.

A tool that did not have that switch would return infinities at the top of every well.

## The misconception to avoid

"The magnetic reference is a detail for the survey company." It is an input to the position uncertainty of every well drilled at that location, it changes the largest terms in the budget, and choosing an in-field reference over a global model is a decision with a cost and a measurable benefit. The Expert tier shows what a declination error alone does to a position.

## Exercise

The validation well has a dip of 72 degrees and a total field of 50000 nT.

Compute the horizontal component of the field. Then compute it again for a dip of 30 degrees at the same total field, and state the ratio. Say what that ratio implies for the azimuth error caused by a fixed magnetometer bias at the two locations.
