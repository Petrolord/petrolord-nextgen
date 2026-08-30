# The three length terms

Three forms, one of which is not what you would guess.

{{panel:ct-tubing-explorer}}

## The three

    piston length     = -piston force x L / (E x A)
    ballooning length = -(2 x 0.3 x L / E) x (dPi x Ai - dPo x Ao) / A
    thermal length    = alpha x L x dT

All three carry the length, unlike the forces, of which only none did.

## Piston

Hooke's law on a bar, with a sign flip. A piston force that pulls up on the tubing shortens the part of it below, so a positive piston force gives a negative length change.

Production heating: 35712.418834005 N over 2500 m of a section of 0.0016710888367848843 square metres at 206800000000 Pa gives minus 0.2583504382230952 m.

## Ballooning

The Poisson strain, integrated over the length.

Production heating gives minus 0.19688910263099973 m. Notice it is about three quarters of the piston term, which is a coincidence of this geometry and not a rule.

## Thermal

The only one that is exactly what a first course would give.

    0.000012 x 2500 x 45 = 1.35 m

No area, no modulus, no pressure. Just the coefficient, the length and the temperature change.

## The sum

| case | piston (m) | ballooning (m) | thermal (m) | total (m) |
|---|---|---|---|---|
| production heating | -0.2583504382230952 | -0.19688910263099973 | 1.35 | 0.8947604591459051 |
| injection cooling | -0.5167008764461904 | -0.39377820526199947 | -0.9 | -1.81047908170819 |
| stimulation | -1.0938466271670424 | -0.7512894859592019 | -1.5000000000000002 | -3.3451361131262445 |

## The one that is missing

There is a fourth length term in the classical Lubinski treatment: the shortening due to BUCKLING. A helically buckled string wraps around the inside of the casing and the wrapped length is shorter end to end than the straight one.

This engine does not compute it. That is a real omission and it matters on the one case that buckles, where the true length change is smaller than the reported 0.8947604591459051 m.

## Why the pressure terms always shorten

Look at the two signs. On a bore pressure event both piston and ballooning are positive forces, and both give negative lengths.

So pressure alone always makes the string shorter and temperature decides everything else. On this string, at these magnitudes, the temperature term is bigger than both pressure terms together in all three cases.

## Exercise

Compute the thermal length change for a 3200 m string at 100 degrees of mean temperature change.

Then say what fraction of that a typical seal assembly of 2 m of stroke could absorb.
