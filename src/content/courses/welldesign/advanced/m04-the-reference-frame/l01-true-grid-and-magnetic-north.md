# True, grid and magnetic north

Three directions, and the two angles between them.

## The three, again, properly

**Magnetic north** is the direction of the horizontal component of the earth's field where the tool is. It is what a magnetometer measures and it moves, year to year and hour to hour.

**True north** is the direction of the geographic pole. Fixed, and the reference the magnetic model is expressed against.

**Grid north** is the direction of the northing axis of the map projection the field uses. Fixed for a given projection, and equal to true north only on the projection's central meridian.

## The two angles

**Declination** is the angle from true north to magnetic north, positive east. It varies with position and with time, and it is what the world magnetic model computes.

**Grid convergence** is the angle from true north to grid north, positive east. It depends only on position and on the projection, not on time.

    true = magnetic + declination
    grid = true - convergence

Both signs are conventions and both have been implemented backwards in real software. The check is a case with a known answer, and the panel's magnetics view provides one.

## Which north a survey is in

Whichever its header says, and the header must say.

An MWD tool measures magnetic azimuth. The survey provider corrects it to true or to grid before delivering, using a declination and a convergence they chose. What arrives is therefore already corrected, and the correction is recorded rather than obvious.

The error model in the Professional tier reads the header, converts the input azimuths to true internally for the magnetic weighting functions, and keeps the frame straight. A header that says grid when the numbers are magnetic produces an answer that is wrong by the declination, everywhere, with no symptom.

## The sizes, and what they cost

Declination is a few degrees in most producing basins and reaches tens of degrees at high latitude. Convergence is usually under two degrees.

A one degree azimuth error at 3000 m of horizontal displacement is about 52 m of lateral position. That is larger than most drilling targets and comparable to the entire uncertainty ellipse from the Professional tier.

So a north-reference error is not a contribution to the uncertainty budget. It is a systematic displacement of the whole well, larger than the budget, and outside the model entirely.

## Why anti-collision cares particularly

Because both wells must be in one frame, and two wells whose headers disagree are rotated relative to each other by the difference.

Two wells 3000 m out, one referenced to grid and one to true with a convergence of 1.5 degrees, are misplaced relative to each other by nearly 80 m. A scan on that pair is answering a question about a geometry that does not exist.

## The thing to check

Both wells' headers, before the scan, every time. Azimuth reference, declination, convergence, and the date the declination was computed for.

That is four fields and it takes a minute, and it catches the largest single error available in this material.

## The misconception to avoid

"The survey is in degrees, so it is in degrees." An azimuth is an angle FROM something, and there are three candidates that differ by degrees. A number without its reference is not an azimuth, and the three references are close enough that the numbers look interchangeable and far enough apart to move a well by more than its uncertainty.

## Exercise

A well is surveyed with magnetic azimuths and delivered with a header stating grid north, declination 2.4 degrees east, convergence 0.9 degrees east.

Say what conversion the provider should have applied. Then compute the lateral position error at 2500 m of horizontal displacement if they applied no conversion at all.
