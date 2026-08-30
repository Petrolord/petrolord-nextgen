# Working the capstone

Six numbers at one depth, on a hole attitude the lessons never ran.

{{panel:gm-stability-explorer}}

## What is asked

At 2000 m of true vertical depth, on the capstone's own parameter set:

1. The **collapse pressure**, in pascals.
2. The **fracture initiation pressure**, in pascals.
3. The **breakout angle**, in degrees from the high side.
4. The **collapse equivalent mud weight**.
5. The **fracture initiation equivalent mud weight**.
6. The **window width**, in equivalent mud weight.

## The settings

The Associate capstone's parameter set, unchanged: a Poisson ratio of 0.24, a friction angle of 26 degrees, a Young's modulus of 18000000000 Pa, tectonic strains of 0.0002 and 0.0005, a Biot coefficient of 0.9, an SHmax azimuth of 105 degrees and a tensile strength of 2500000 Pa.

The hole is at **55 degrees of inclination on an azimuth of 130 degrees**. The lessons run 0, 30, 60 and 90 degrees of inclination on azimuths of 0, 60 and 150. Neither of these is one of them.

The strength is the **Horsrud UCS for a sonic reading of 233 microseconds per metre**, which is the Associate capstone's field 5. Not the profile's own published UCS at 2000 m.

## The order

Field 1 and field 2 come from one stability run. Fields 4 and 5 are those two divided by g times 2000. Field 6 is the difference of fields 4 and 5, or equivalently field 2 less field 1 over the same divisor.

Field 3 comes out of the same run and needs nothing else.

## The traps

**The stresses are the capstone's, not the profile's published ones.** Fields 3 and 4 of the Associate capstone ARE the two horizontal stresses this run needs. If you did that tier, you already have them.

**The UCS is the capstone's, not the profile's.** The profile's published UCS at 2000 m came from the profile's own sonic sample. The capstone uses a core plug reading instead, and it is a different number.

**The Biot coefficient is 0.9.** It enters the effective stresses at the wall as well as the stress model.

**Field 3 is an angle in the BOREHOLE frame**, measured from the high side, not a compass bearing.

**Fields 1 and 2 are in pascals**, and the difference between pascals and megapascals is a factor of a million that no tolerance will catch.

## The free check

Field 4 plus field 6 must equal field 5, exactly. They are the same three numbers divided by the same denominator.

If your three do not close, one of them was computed at a different depth or with a different divisor.

## What to notice

The window at this attitude is narrower than a vertical hole at the same depth on the same parameters. That is the expected direction, and working out whether the azimuth of 130 degrees is helping or hurting relative to the SHmax azimuth of 105 is a good use of the panel.

## Exercise

Before running the stability calculation, use the vertical closed forms to compute what fields 1 and 2 would be for a VERTICAL hole at 2000 m on the capstone parameters.

Then run the real attitude and say by how much each moved, and in which direction.
