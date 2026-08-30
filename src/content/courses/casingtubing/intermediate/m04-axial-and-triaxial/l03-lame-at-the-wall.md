# Lame at the wall

The exact stress state in a thick cylinder, and why the differential is not enough.

{{panel:ct-loadcase-explorer}}

## The three stresses

At radius r inside the wall of a cylinder with inside pressure pi at radius ri and outside pressure po at radius ro:

    hoop   = (pi ri^2 - po ro^2 + (pi - po) ri^2 ro^2 / r^2) / (ro^2 - ri^2)
    radial = (pi ri^2 - po ro^2 - (pi - po) ri^2 ro^2 / r^2) / (ro^2 - ri^2)
    axial  = axial force / steel area

That is the Lame solution, and it is exact for a thick-walled cylinder in plane strain.

## What Barlow was

An average. Barlow puts one hoop stress across the whole wall. Lame says the hoop stress is highest at the bore and lowest at the outside surface, and the difference is a few percent at these wall ratios.

## Why both pressures matter separately

Look at the two formulas. Each contains pi and po in two different combinations, and only the term with 1/r squared depends on their difference alone.

So a case with 60 MPa inside and 30 outside has a different wall stress state from one with 30 inside and zero outside, even though the burst differential is 30 MPa in both.

Burst and collapse throw that information away. Triaxial does not.

## Where the engine evaluates it

At the bore and at the outside surface, and takes the worse of the two. Not at a midpoint and not averaged.

That is right, because both extremes are candidates: under internal pressure the bore is worst, and the sign of the outside stress can flip when the external pressure dominates.

## The other two things the axial stress does

It enters the triaxial calculation directly, which is a different route from the collapse derating.

So the axial force appears in this check twice over the string: once as a stress in its own right here, and once as a yield derating inside the collapse formulas. They are separate mechanisms and both are real.

## Exercise

For the 9-5/8 inch 47 lb/ft section, ro is 0.1222375 m and ri is 0.1102487 m.

Compute the hoop stress at the bore and at the outside surface for pi of 38501507.98608063 Pa and po of zero, and say which of the two the check will use.
