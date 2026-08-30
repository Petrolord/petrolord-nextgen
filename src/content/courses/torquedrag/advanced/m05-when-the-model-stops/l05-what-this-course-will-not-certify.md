# What this course will not certify

Four things this engine does not do, taught here and graded nowhere.

## Why state it

Because a course that teaches a topic implies it is worth learning, and a course that CERTIFIES a topic implies the learner can produce the answer and that the answer is worth producing. Those are different claims, and this series separates them deliberately.

The go-live migration for this course asserts the separation: it refuses to run if any graded field key names one of the topics below.

## Stiff-string analysis

The engine implements a SOFT-STRING model. It has no bending stiffness at all.

A stiff-string model carries the pipe's EI through the whole calculation, finds the discrete points where the string actually touches the hole, and computes contact forces at those points rather than smearing them.

It matters where the dogleg is severe, where the component is short and stiff, and where the answer depends on LOCAL contact: casing wear is the obvious case, since a smeared side force gives a smoothly distributed groove where the truth is a series of concentrated ones.

Stiff-string models exist, they are commercial, and they take orders of magnitude longer to run. This engine does not have one.

## Dynamics

Stick-slip, whirl, axial oscillation, and the difference between static and kinetic friction.

Every one of them makes the real loads higher than the computed ones, sometimes by a factor. Stick-slip torque peaks routinely reach twice the mean and the mean is what this computes.

They are also what a driller is actually managing at the console most of the time, which makes their absence from a steady-state model worth being explicit about.

## Hydraulic and thermal effects on the string

Piston forces at every diameter change, ballooning from the pressure differential across the pipe wall, and the length changes from the temperature profile.

For a drill string these are second order. For a completion string they are first order, which is why completion tubing movement analysis is a separate discipline with a separate model.

The engine has none of it: it takes one mud density and applies a single buoyancy factor.

## Post-lock-up behaviour

The engine computes the two buckling limits and flags where they are exceeded. It does not change the friction when they are.

So it cannot predict lock-up, cannot predict the maximum reachable lateral length, and cannot tell you how much worse than its own answer the real hookload is. It can only tell you that its answer is optimistic and by how far past the limit the string has gone.

## What IS certified

The soft-string loads on a stated geometry with a stated friction factor: hookload, torque, tension, side force, the two buckling limits, the two utilizations, and the casing wear those side forces produce over a stated rotating schedule.

That is a well defined and useful thing, and stating its edges is what makes it usable by somebody who was not in the room.

## Exercise

For each of the four omissions, name a specific well or operation where it would be the thing that decided the outcome.

Then say which one you would want implemented first, and what it would cost to run.
