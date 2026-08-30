# Azimuth, and which north

Three norths, degrees apart, and every position in the well depends on which one was used.

## The three

**Magnetic north** is where a compass points: the direction of the horizontal component of the earth's magnetic field at that place and time. An MWD tool measures it directly, because magnetometers are what it has.

**True north** is the direction of the geographic pole. It differs from magnetic north by the DECLINATION, which varies with position, varies with time, and is described by a global model.

**Grid north** is the direction of the northing axis of whatever map projection the field uses. It differs from true north by the CONVERGENCE, which is zero on the projection's central meridian and grows as you move east or west of it.

## The sizes involved

Declination is a few degrees in most producing basins and reaches tens of degrees at high latitude. Convergence is usually under two degrees but is not negligible at the edges of a projection zone.

A one degree azimuth error over 3000 m of horizontal displacement is about 52 m of position. That is larger than most targets and comparable to the whole uncertainty ellipse the Professional tier computes.

So getting the north reference wrong is not a rounding issue. It is a category of error that puts the well in the wrong place by more than the uncertainty model says it can be.

## The conversion

    true azimuth = magnetic azimuth + declination
    grid azimuth = true azimuth - convergence

Declination is positive east. Convergence is positive east of the central meridian. Both conventions have been written the other way round in real software, which is why the Expert tier makes you check the sign against a case whose answer is known.

## Why the survey system needs the field as well

The error model in the Professional tier will not run without two more numbers: the total magnetic field strength and the dip angle at the well.

That is not bureaucracy. A magnetic survey's azimuth accuracy depends on how much of the field is horizontal, which is what dip controls, and on how large the field is relative to any interference. At high dip, near the poles, a magnetic azimuth is very poor and gyroscopic surveys are used instead.

Those two numbers come from the same global model as the declination. The Expert tier checks that model against its publisher's own test values.

## What a report must state

A survey listing is not usable without its azimuth reference. The ISCWSA validation well used in this course states it explicitly in its header: azimuths referenced to true north, declination minus four degrees, convergence zero.

If a listing does not say, the safe assumption is that nobody knows, and the correct action is to ask rather than to guess.

## The misconception to avoid

"Declination is a small correction that averages out." It is a systematic rotation of the entire well below the point where it was applied, it does not average out over stations, and it is one of the largest single contributors to position uncertainty in the budget the Professional tier computes. A whole error source in the ISCWSA model exists for the declination reference alone.

## Exercise

A well at 60 degrees north is surveyed with an MWD tool. The magnetic azimuth at a station reads 90.0 degrees. The declination there is 1.5 degrees east and the grid convergence is 0.8 degrees east.

Compute the true azimuth and the grid azimuth. Then compute how far apart, in metres, two positions 3000 m out along those two azimuths would be, and compare that against a typical drilling target radius of 50 m.
