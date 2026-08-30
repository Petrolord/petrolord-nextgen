# Why the gas kick governs at surface

Two gradients, one subtraction, and the answer is the wellhead.

{{panel:ct-loadcase-explorer}}

## The slope

    d(differential)/dz = gas gradient - seawater gradient
                       = 2300 - 10100.8495
                       = -7800.8495 Pa per metre

Negative. The burst differential SHRINKS as you go down, by about 7.8 kPa for every metre.

## What that means

The worst burst load in a gas kick is at the shallowest point in the section, and for the top section that is the wellhead itself.

Not the shoe. Not the casing seat. The christmas tree.

## The numbers on the published string

Section 1, 9-5/8 inch 47 lb/ft P-110, burst rating 65086506.08 Pa.

| depth | differential (Pa) | safety factor |
|---|---|---|
| 0 | 38501507.98608063 | 1.6904923854809817 |
| 501.5839398602 | 34588727.15961149 | 1.881725967528522 |
| 1003.1678797204 | 30675946.333145022 | 2.121744032707306 |
| 1454.59342559458 | 27154443.5893252 | 2.396900745393525 |

The reported safety factor for the section is 1.6904923854809817, at 0 m.

## Why this is counterintuitive

Because everything else about a well gets worse with depth. Pressure, temperature, tension in the drillstring, the cost of a mistake. The instinct is to check the bottom.

Burst under a gas kick is the exception, and it is the exception for a very simple reason: the thing pushing outward is nearly weightless and the thing pushing inward is not.

## The physical picture

Imagine standing at the shoe. Inside the pipe is a tall column of gas that weighs almost nothing, so the pressure it delivers here is nearly the same as the pressure at the top of it. Outside is a tall column of water that weighs a great deal, so it delivers 25 MPa of help.

Now walk to surface. The inside pressure has barely dropped. The outside help has gone to zero. The pipe is on its own.

## The wellhead consequence

This is why wellhead equipment and the top joints of a production string are rated for the full shut-in surface pressure, and why the surface section of a string is often a higher grade than the section below it.

The published string does exactly that: P-110 on top, L-80 below.

## Exercise

Section 2, 9-5/8 inch 53.5 lb/ft L-80, has a burst rating of 54656619.12727273 Pa and its top grid point is at 1504.7518195805999 m.

Given the slope above and the surface differential of 38501507.98608063 Pa, compute the differential at that depth, then the safety factor, and check it against the panel.
