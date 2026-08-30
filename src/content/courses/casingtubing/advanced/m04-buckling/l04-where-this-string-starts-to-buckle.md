# Where this string starts to buckle

Two temperatures, found by bisection rather than read off a sweep.

{{panel:ct-tubing-explorer}}

## The question

At a fixed bore pressure change of 10 MPa, at what mean temperature change does this string first buckle, and at what temperature does it go helical?

## The answers

    sinusoidal onset  30.45640382594624 degrees
    helical onset     43.11622208089929 degrees

Both above zero, because at zero temperature change the pressure terms alone put the string in tension.

## How they are found

By bisection on the temperature, not by scanning a table.

A sweep at five degree steps would place the sinusoidal onset somewhere between 30 and 35 and stop there. The bisection converges to the machine's precision in a hundred iterations, and the result is a number rather than an interval.

That matters for a threshold that is going to be quoted. A finding of "buckles above about 30 degrees" and one of "buckles above 30.45640382594624 degrees" are different kinds of statement, and only the second one can be checked by somebody else.

## The gap between the two

12.659818254953054 degrees separates the sinusoidal onset from the helical one.

That gap is not arbitrary: it is the gap between the two limits, 1.8284271247461903 in ratio, converted to temperature through the thermal coefficient of 4146.974057365369 N per degree.

    (115872.96889413144 - 63373.03101988061) / 4146.974057365369 = 12.659818254953054

## What the production case is doing

45 degrees, which is 1.88 degrees past the helical onset. The string is helical and it is barely helical.

That is worth stating carefully. The published finding is that the production case buckles helically. The finding is TRUE and it is 1.88 degrees deep, and a thermal model that came out two degrees cooler would report sinusoidal instead.

## The general point

Every threshold in this tier is a crossing, and every crossing has a distance either side of it.

Report the crossing without the distance and the reader has no way to tell a robust result from a marginal one. Both of the buckling results on this string are marginal, and both are true.

## Exercise

Find the temperature change at which the string would first buckle if the bore pressure change were 30 MPa instead of 10.

Then say by how much the onset moved, and check that against the piston and ballooning coefficients.
