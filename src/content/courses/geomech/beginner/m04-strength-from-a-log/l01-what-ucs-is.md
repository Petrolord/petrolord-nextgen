# What UCS is

The strength number, and what it is the strength of.

{{panel:gm-stress-explorer}}

## The definition

Unconfined compressive strength: the axial load per unit area at which a cylinder of the rock fails when nothing is holding its sides in.

It is measured by squeezing a core plug in a press until it breaks, with the plug free to bulge sideways.

## The word unconfined

That is the whole qualification. Confine the same plug, by holding its sides at a pressure, and it carries far more.

Rock is much stronger under confinement, which is why a deep hole is not automatically less stable than a shallow one even though the loads are far larger.

## Where it appears

In the Mohr-Coulomb criterion, as the intercept:

    sigma1_effective <= UCS + q x sigma3_effective

The largest effective principal stress the rock can carry equals its unconfined strength plus q times the smallest one. Set the confinement to zero and the largest it can carry is exactly UCS, which is the definition again.

## The two parameters

**UCS** is the intercept: strength with no confinement.

**q**, from the friction angle, is the slope: how much extra strength each unit of confinement buys.

Both are needed. A rock with a high UCS and a low friction angle is strong when unconfined and gains little from burial; one with the opposite is the reverse. The friction angle lesson two on from here is about the slope.

## What this profile carries

A UCS column that climbs steeply with depth:

| true vertical depth | sonic | UCS |
|---|---|---|
| 50 m | 494 us/m | 7354691.975767447 Pa |
| 1000 m | 380 us/m | 17028767.50224198 Pa |
| 1500 m | 320 us/m | 29512825.809667617 Pa |
| 2000 m | 260 us/m | 57355624.34844943 Pa |
| 2600 m | 188 us/m | 161877171.58368286 Pa |

From about 7 MPa to about 162 MPa over 2550 m: a factor of 22.

## Why it climbs so fast

Because it comes from a sonic log through a correlation with a cubic exponent, and the sonic slowness halves over the interval. The next lesson is that correlation.

Physically, the rock is compacting: porosity falls with depth and strength rises steeply as it does.

## A caution about the top

7 MPa at 50 m is a weak rock, and the correlation was not built for material that soft. A screening correlation extrapolated beyond its calibration range gives a number, and a number is not the same as an answer.

## Exercise

For a rock with a UCS of 30 MPa and a friction angle of 30 degrees, compute the largest effective stress it can carry with zero confinement, and again with 10 MPa of confinement.

Then say by what factor the confinement increased its capacity.
