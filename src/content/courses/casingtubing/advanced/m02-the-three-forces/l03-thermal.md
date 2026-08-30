# Thermal

The one force with a minus sign in front of it, and usually the biggest.

{{panel:ct-tubing-explorer}}

## The formula

    thermal = -E x A x alpha x dT

with E at 206800000000 Pa, A the steel section at 0.0016710888367848843 square metres, and alpha the thermal expansion coefficient of steel at 0.000012 per degree.

Multiply those three: 4146.974057365369 N per degree of temperature change on this string.

## Where it comes from

A bar that is heated by dT and not allowed to change length carries a stress of E times alpha times dT. Multiply by the area for a force. The minus sign says that heating gives compression.

Note what is NOT in it: the length. A 500 m string and a 5000 m string of the same pipe produce the same force for the same mean temperature change.

That is one of the more surprising facts in this tier, and it follows directly from the formula having no length in it.

## The three cases

| case | dT | thermal (N) |
|---|---|---|
| production heating | 45 | -186613.83258144156 |
| injection cooling | -30 | 124409.22172096104 |
| stimulation | -50 | 207348.7028682684 |

Each is 4146.974057365369 N per degree, with the sign flipped.

## Length is a different story

The LENGTH change from temperature is alpha times length times dT, and that one does contain the length. So a long string moves more for the same force.

    2500 m at 45 degrees: 0.000012 x 2500 x 45 = 1.35 m

A metre and a third of movement at the bottom of the string, from a temperature change that would be unremarkable at surface.

## Why it usually wins

Compare the three columns on the production heating case: 35712 piston, 27216 ballooning, 186614 thermal. The temperature term is nearly three times the other two put together.

That is typical. A 45 degree mean change is a modest operating swing and 10 MPa is a modest pressure change, and the temperature term still dominates.

## What the model leaves out

A single mean temperature change for the whole string, taken as an input or derived from a linear profile. No transient, no radial gradient across the wall, no annulus fluid expansion, and no coupling between the temperature and the pressures.

Every one of those is real, and the last one in particular: heating a sealed annulus raises its pressure, which changes the piston and ballooning terms, and this model does not close that loop.

## Exercise

Compute the thermal force for a mean temperature change of 70 degrees on this string.

Then compute it for the same 70 degrees on a 4-1/2 inch 12.75 lb/ft tubing with a steel area of 0.0023228666671479964 square metres, and say what the ratio of the two is.
