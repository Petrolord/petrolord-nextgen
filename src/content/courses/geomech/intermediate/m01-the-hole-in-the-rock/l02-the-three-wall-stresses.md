# The three wall stresses

Hoop, axial and radial, and what each depends on.

{{panel:gm-stability-explorer}}

## The radial stress

    sigma_rr = Pw - Pp

The difference between the well pressure and the pore pressure. It is the same at every angle round the hole, because the mud does not know which way is up.

It is the only one of the three that the driller controls directly.

## The hoop stress

    sigma_thetatheta = s11 + s22 - 2(s11 - s22)cos(2theta) - 4 s12 sin(2theta) - dP

with theta measured round the hole from the high side and the s terms the far-field stresses rotated into the borehole frame.

Two things to read in it. The cosine of twice the angle means it goes through a full cycle every half turn, so it has two maxima and two minima round the hole. And the differential pressure enters with a minus sign, so raising the mud weight lowers it everywhere at once.

## The axial stress

    sigma_zz = s33 - nu[2(s11 - s22)cos(2theta) + 4 s12 sin(2theta)]

The far-field stress along the hole axis, plus a Poisson correction for the hoop stress variation.

That correction is why the Poisson ratio appears at the wall as well as in the stress model. It is usually small compared with the hoop variation, because nu is well below one.

## The shear term

    tau_thetaz = 2(s23 cos(theta) - s13 sin(theta))

Zero for a vertical hole in this stress field, and non-zero as soon as the hole deviates.

That term is the entire difference between a vertical well problem and a deviated well problem, and it is what makes the deviated case need a full tensor rotation rather than a two-dimensional picture.

## Turning them into principal stresses

The hoop and axial stresses share a plane with the shear term between them, so the two of them plus the shear combine into a principal pair by the usual Mohr construction:

    mean +/- sqrt(((hoop - axial)/2)^2 + shear^2)

The radial stress is already principal, because there is no shear on the free surface of the hole.

So there are three principal stresses at the wall at every angle, and the failure criteria compare the largest and the smallest of those three.

## Why the radial stress being principal matters

Because at high mud weights the radial stress can become the LARGEST of the three, and then the Mohr-Coulomb criterion is comparing the mud against the hoop stress rather than the other way round.

That is why the collapse criterion is not monotone in the well pressure, which module 5 examines.

## Exercise

For a vertical hole in this stress field at 2500 m, write out the three wall stresses at theta of 0 and at theta of 90 degrees with a differential pressure of zero.

Then say which is the largest and which is the smallest at each angle.
