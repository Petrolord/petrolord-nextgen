# What an azimuth reference error does

A rotation of the whole well, and why the uncertainty model does not see it.

## The shape of the error

An azimuth reference error is a constant angular offset applied to every station below the point where it enters.

That is not a scatter and it is not a growing random walk. It is a rigid ROTATION of the entire well path about the vertical axis through the point where the error started.

## The magnitude

A rotation of angle e displaces a point at horizontal distance d by approximately

    displacement = d x e (in radians)

So one degree at 1000 m is 17 m, at 3000 m is 52 m, and at 6000 m is 105 m.

The displacement is perpendicular to the direction of travel, which is the LATERAL direction from the Professional tier: exactly the component that anti-collision cares about most and that is already the largest.

## Why the model does not catch it

The error model has declination sources, and they cover the RESIDUAL uncertainty after a correction has been applied properly.

What it does not cover is a correction applied with the wrong sign, applied twice, not applied at all, or taken from a header that misdescribes the data. Those are gross errors, and the Professional tier's fifth module listed gross errors as the first thing the model excludes.

So a well with a reference blunder sits well outside its own ellipse, and nothing in the calculation says so.

## The four ways it happens

**No conversion.** Magnetic azimuths delivered as true.

**Wrong sign.** Declination subtracted where it should have been added, which doubles the error.

**Applied twice.** Once by the tool's own software and once by the office, which also doubles it.

**Wrong epoch.** A declination computed for the wrong year, giving the drift as an offset.

Each is invisible in the survey listing, because a listing of rotated azimuths looks exactly like a listing of correct ones.

## How it is caught

**Compare against the plan.** A well that is drilling on plan in inclination and consistently off in azimuth, in one direction, from the top, is a reference error rather than a steering problem.

**Compare two surveys of the same well.** A gyro run and an MWD run should agree. A constant offset between them is a reference error, and which one is wrong is then a separate question.

**Check the header arithmetic.** The declination in the header, the convergence in the header, and the azimuth reference stated: those three should be consistent with the correction actually applied, and the provider can confirm it.

**Plot the wells.** Two wells that should be parallel and are not, by a constant angle, is the signature.

## Why it matters most for anti-collision

Because the two wells are usually surveyed by different parties at different times.

An error that rotates BOTH wells identically largely cancels in their relative position, which is the global-source argument from the Professional tier. An error that rotates one and not the other is a pure relative displacement, and it is the worst case for a clearance calculation.

## The misconception to avoid

"A reference error would show up as a poor survey." It shows up as a perfectly consistent survey of a well that is somewhere else. Every internal check passes: the doglegs are smooth, the closure is sensible, the listing is clean. The only checks that catch it compare against something OUTSIDE the survey.

## Exercise

Two wells are drilled from adjacent slots. One is surveyed with declination applied correctly, the other with it applied twice, at a location where the declination is 3 degrees east.

Compute the relative angular error between the two wells, and the resulting relative displacement at 2000 m of horizontal reach. State whether an anti-collision scan on the pair would report the wells as closer or further apart than they are, and say why the answer depends on the geometry.
