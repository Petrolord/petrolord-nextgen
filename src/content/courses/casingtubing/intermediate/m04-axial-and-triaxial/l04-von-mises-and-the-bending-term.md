# Von Mises, and the bending term

Three stresses into one number, plus the one the trajectory adds.

{{panel:ct-loadcase-explorer}}

## The equivalent stress

    vme = sqrt( 0.5 x [ (hoop - radial)^2 + (radial - axial)^2 + (axial - hoop)^2 ] )

One number that says how close a three-dimensional stress state is to yielding. The triaxial safety factor is the yield strength divided by it.

## The check it reduces to

Under pure axial tension, with no pressure anywhere, the hoop and radial stresses are zero and the expression collapses to the axial stress itself. So the triaxial safety factor becomes the yield strength over the axial stress, which is exactly the tension check.

That identity is worth knowing because it is the sanity test: a triaxial implementation that does not reproduce the tension answer under pure tension is wrong, and the engine's own test asserts it.

## The bending term

A string in a curved hole is bent, and bending puts an extra axial stress on the outside of the curve and takes it off the inside.

    curvature = dogleg in degrees per 30 m, in radians per metre
    bending stress = E x (outside radius) x curvature

with E at 206800000000 Pa.

At the published dogleg of 2 degrees per 30 m, on a 9-5/8 inch pipe, that comes to a meaningful fraction of the axial stress, and the engine evaluates the von Mises expression with the bending stress ADDED and again with it SUBTRACTED, taking the worse.

## Why both signs

Because which side of the pipe is worse depends on the sign of the axial force and on the pressures. On a string in tension the outside of the bend is worse; reverse the axial force and the inside is. Evaluating both and taking the maximum removes the need to know which.

## What the bending term is not

It is not a fatigue calculation, and it is not a check that the pipe can be run through the dogleg. It is a static stress addition at a stated curvature.

It also uses one dogleg for the whole string. A real trajectory has a dogleg profile, and the worst dogleg is rarely at the worst pressure.

## The one place it decides something

The single non-passing verdict in this whole suite comes from the triaxial check, and it comes from it partly because of this bending term. Take the dogleg to zero and that verdict changes.

## Exercise

Compute the bending stress for the 9-5/8 inch pipe at a dogleg of 2 degrees per 30 m, using an outside radius of 0.1222375 m.

Then repeat it at 5 degrees per 30 m, and say what fraction of the P-110 yield strength of 758423270 Pa each of them is.
