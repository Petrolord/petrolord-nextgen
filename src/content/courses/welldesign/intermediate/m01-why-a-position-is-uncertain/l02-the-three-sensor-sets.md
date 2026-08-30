# The three sensor sets

Accelerometers, magnetometers and a depth counter, and what each one is bad at.

## Accelerometers

Three of them, mounted along the tool axis and across it. They measure the components of gravity in the tool's frame, which gives the inclination and the toolface.

**They are excellent at inclination.** Gravity is large, constant and well known, so accelerometer-derived inclination is typically good to a tenth of a degree.

**They fail near horizontal in one specific way.** The axial accelerometer reads the component of gravity along the hole, which goes to zero at 90 degrees. Near horizontal the inclination is derived from the two cross-axial sensors instead, and the geometry changes.

**They cannot be used while moving.** Any acceleration adds to gravity, so surveys are taken with the string stationary. That is why the survey interval is set by connections.

## Magnetometers

Three of them, same arrangement. They measure the earth's field in the tool frame, which combined with the accelerometers' down direction gives the azimuth.

**They are much worse than the accelerometers.** The earth's field is small, it varies with place and time, and there is a large piece of steel a few metres away in both directions.

**They fail near vertical.** At zero inclination azimuth is undefined, and near zero it is very poorly determined, because the horizontal projection the azimuth is measured in shrinks. The error model has an explicit vertical inclination limit for this reason, and switches formulation below it.

**They fail on north-south holes at high dip.** The azimuth accuracy depends on how much of the field is horizontal and on the direction the hole is pointing relative to it. A near-east-west hole is well determined; a north-south hole at high magnetic dip is not, and this is the axial interference geometry that the largest error source in this course's validation well exploits.

**They are affected by the drill string.** The collars above and below the tool are steel and they channel the field along the hole. That is why the tool sits in a non-magnetic collar, and why the required length of non-magnetic spacing is a design calculation.

## The depth counter

**It is not a sensor at all.** It is a count of pipe, corrected for stretch.

**Its errors are systematic.** A reference error shifts everything. A scale error grows with depth. Thermal expansion and pressure both stretch the string in ways that vary down the hole.

The error model treats depth separately for this reason: three of the twenty-seven sources in the standard model affect depth only, and they are identifiable as such because their weighting functions have no inclination or azimuth component at all.

## The gyroscopic alternative

A gyro measures rotation rather than the magnetic field, so it has none of the magnetic problems. It is used inside casing, where magnetometers are useless, near other wells, where interference is severe, and at high latitude.

It has different problems: drift with time, a north-seeking accuracy that also degrades at high latitude, and a much higher cost per station. It has its own error model with its own sources.

This course uses the MWD magnetic model throughout, because that is what the validation case and the clearance examples use.

## The misconception to avoid

"Inclination and azimuth are equally accurate." They are not close. Inclination from accelerometers is good to about a tenth of a degree; azimuth from magnetometers is good to perhaps half a degree in favourable geometry and much worse in unfavourable. That asymmetry is why the uncertainty ellipse this tier computes is long across the well and short along it.

## Exercise

For each of the three sensor sets, name the well geometry in which it performs worst.

Then, for a well that is vertical at surface and horizontal at total depth heading due north at high magnetic dip, say which sensor set is the limiting one in each third of the well.
