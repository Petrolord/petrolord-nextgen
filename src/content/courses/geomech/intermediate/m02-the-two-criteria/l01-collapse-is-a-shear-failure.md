# Collapse is a shear failure

What actually happens when a hole caves in.

{{panel:gm-stability-explorer}}

## The picture

Too little mud in the hole. The hoop stress at the peak is very large and the radial stress is very small, so the rock there is being squeezed hard in one direction with almost nothing holding it in the other.

It fails in shear, along planes at an angle to the principal directions, and pieces spall off the wall.

## What it looks like at surface

**Cavings on the shakers.** Angular, blocky pieces, larger than the drilled cuttings and with a different shape.

**An enlarged hole on the caliper**, in two lobes 180 degrees apart.

**Torque and drag rising**, as the cuttings load in the annulus grows and the hole geometry stops being round.

**A pack-off**, if enough material comes in at once and the annulus cannot carry it.

## What it is not

It is not the hole closing in. Collapse in this sense makes the hole BIGGER, not smaller.

A hole that genuinely closes in is creep, which is what salt and some very plastic shales do, and it is a time-dependent process this model does not have.

## Why the model calls it collapse anyway

Because the word is standard and the failure is the same one. The rock at the wall exceeds its shear strength. Whether the debris falls into the hole or squeezes into it depends on the rock, and this criterion covers the first case.

## The criterion

Mohr-Coulomb, evaluated at the wall:

    sigma1_effective <= UCS + q x sigma3_effective

with sigma1 the largest of the three principal wall stresses and sigma3 the smallest.

Satisfy it at every angle round the hole and no breakout forms. Violate it anywhere and one does.

## What the engine reports

The smallest well pressure that keeps the criterion satisfied at EVERY angle. That is the collapse pressure, and the angle at which it is tightest is the breakout angle.

## The conservatism in that

Requiring the criterion at every angle means requiring ZERO breakout width. A real hole tolerates some breakout: a 30 degree wide breakout on each side is often drilled through without incident.

So the collapse pressure this engine reports is the pressure at which a breakout would just begin, not the pressure at which the hole becomes unusable. That is a stated conservatism and lesson four in this module is about it.

## Exercise

For the rock at 2500 m, compute the largest effective stress it can carry with 10 MPa of confinement and with 30 MPa.

Then say roughly how much confinement it would need to carry the peak hoop stress you computed in module 1.
