# Combined loading, and what this engine does not do

Two utilizations, one pipe, and the check that is missing.

## The problem

The top joint of drill pipe carries the maximum tension and the maximum torque at the same moment.

Axial tension produces a direct stress. Torque produces a shear stress. A material does not care which is which; it cares about the combined stress state, and yields when a combination of them reaches a criterion.

## What a combined check looks like

The usual criterion is von Mises. In the simple case of axial tension plus torsion it gives an ellipse in the (tension, torque) plane: the pipe is safe inside it and yields outside it.

A pipe at 70 percent of its tensile rating and 70 percent of its torsional rating is at neither limit individually, and it is very close to the combined one.

## What this engine does

    utilization = { tension: |T| / tensileCapacity, torsion: |M| / torsionalCapacity }

Two independent ratios, each against its own rating. No interaction term.

The warning fires above 0.8 on either one. It would not fire on a pipe at 0.7 and 0.7, which is a more dangerous state than either alone.

## Is that a defect

It is a scope decision, and it is one worth stating explicitly rather than leaving implicit.

The engine is a torque and drag calculator. It produces the loads. A pipe strength check is a different calculation with its own standards, its own safety factors, its own treatment of connections, wear and bending stress, and its own inputs the torque and drag model does not have.

Doing half of it inside a torque and drag tool would be worse than not doing it, because it would look like the whole check.

## What is also missing from the utilization

**Bending stress.** A pipe passing through a dogleg carries a bending stress that adds to the axial one at the outer fibre. In a hard dogleg it is substantial, and the soft-string model does not compute it at all because it assumed the pipe has no bending stiffness.

**Wear.** A worn pipe has less wall and less of both capacities.

**Connections.** Usually the weakest element and not modelled here.

**Dynamic loads.** Stick-slip torque peaks can be several times the mean, and the mean is what this computes.

## The right use of the two ratios

As a screening indicator. If both are small, the pipe is not the problem and you can move on. If either is above about half, the loads should go into a proper pipe strength check.

That is what they are for, and the 80 percent flag is set well above where that handover should happen.

## Exercise

For the build-and-hold well, take the two utilizations and estimate the von Mises utilization by combining them in quadrature with the shear term weighted by root three.

Compare against the larger of the two individual ratios, and say how much margin the independent check gave away.
