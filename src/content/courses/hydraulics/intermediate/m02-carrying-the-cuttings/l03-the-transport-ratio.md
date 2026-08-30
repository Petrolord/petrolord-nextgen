# The transport ratio

One number for whether the cuttings are moving.

{{panel:hy-cleaning-explorer}}

## The definition

    transport ratio = 1 - (slip velocity / annular velocity)

The fraction of the mud's speed the cuttings actually travel at.

A ratio of 1 means the cuttings move with the mud exactly. A ratio of 0 means they are falling as fast as the mud is rising, so they stay where they are. A negative ratio means they are going DOWN.

## The numbers

Horizontal well, kcl_polymer:

| flow rate | worst transport ratio |
|---|---|
| 0.015 m3/s | 0.7384068092371119 |
| 0.025 m3/s | 0.8284815558593573 |
| 0.035 m3/s | 0.8712896713371077 |

And for the light mud at the same rates: 0.6474718257291006, 0.7699923145452399 and 0.8275947768887982.

## Why the heavy mud cleans better

Two reasons, and both help.

**Buoyancy.** A denser mud reduces the difference between the cutting's density and the fluid's, which is the driving term in the slip velocity.

**Viscosity.** kcl_polymer is thicker than light_wbm at every shear rate, so it resists the cutting's fall more.

Between them they take the worst transport ratio from 0.77 to 0.83 at 0.025 m3/s, which is a substantial improvement for a mud change alone.

## Where the worst is

In the shallowest, widest annulus, because that is where the velocity is lowest. The transport ratio at the bottom of the well is higher, because the tight annulus around the collars is fast.

The slip velocity is also higher down there, and the velocity term wins.

## What a good number is

Rules of thumb put the target between 0.5 and 0.9 depending on the hole angle and the tolerance for a dirty hole.

Below 0.5 the cuttings are moving at less than half the mud's speed and the annulus fills up. Above 0.9 the flow rate is high enough that the ratio is no longer the constraint.

## What the ratio does not say

Whether the hole is CLEAN. It says how fast the cuttings are moving relative to the mud, and a hole can have a good transport ratio and still be full of cuttings if the rate of penetration is high enough.

The concentration is the other half, and it is the next lesson.

## The one thing to hold on to

This is a vertical-transport model. It computes a falling particle in a rising fluid and it has no term for a bed lying on the low side of an inclined hole.

The engine returns the same transport ratio for the horizontal well as for the slant well, which is the clearest possible statement of that limitation, and module 3 is about it.

## Exercise

From the annular velocities and slip velocities in the previous two lessons, compute the transport ratio for each of the four intervals of the horizontal well at 0.025 m3/s.

Confirm the worst one against the table, and say which interval it is.
