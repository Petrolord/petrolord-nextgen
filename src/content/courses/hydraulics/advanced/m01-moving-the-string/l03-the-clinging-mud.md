# The clinging mud

The term that is not displacement.

{{panel:hy-surge-explorer}}

## The observation

Mud next to a moving wall moves with it. A string going down drags a layer of mud down with it, and that mud is not available to flow up the annulus.

So the effective velocity of the mud relative to the hole is higher than the displacement alone would give.

## The correction

    v_effective = (displaced rate / annular area) + Kc x v_trip

with Kc the clinging constant, 0.45 in this method.

The second term is proportional to the trip speed and has nothing to do with the string's cross section.

## Where 0.45 comes from

Burkhardt's work on surge and swab. It is an empirical constant fitted to measurements, and it is one of the four conventions in this course's method specification.

Published values range from about 0.4 to 0.5 depending on the annulus geometry and the flow regime, and some methods compute it rather than assuming it.

## Why it matters more than its size suggests

Because it does not scale with the displaced volume.

For a closed string the displacement term is large and the clinging term is a correction. For an OPEN string the displacement term is small and the clinging term is a substantial fraction of the total.

That is why the closed-to-open ratio is 1.17 rather than 4: the clinging term is present in both and it is nearly the same in both.

## And why the ratio grows with speed

| trip speed | closed over open |
|---|---|
| 0.2 m/s | 1.1166693331566144 |
| 0.5 m/s | 1.172219719213269 |
| 1.0 m/s | 1.2366215270645167 |

Both terms are proportional to speed, so the ratio of the velocities is constant. The ratio of the PRESSURES is not, because the pressure loss is a nonlinear function of velocity and the two cases sit at different points on that curve.

## The sensitivity

Every surge and swab pressure in this course is proportional to a constant somebody fitted, and moving it from 0.4 to 0.5 moves the answer by a few percent.

That is a modest sensitivity and it is worth knowing, because a surge calculation quoted to four significant figures is carrying a constant with one significant figure of provenance.

## Exercise

Recompute the effective velocity for the open string at 0.5 m/s with a clinging constant of 0.40 and of 0.50.

Then say what fraction of the effective velocity the clinging term represents in each case, and whether the open or the closed case is more sensitive to it.
