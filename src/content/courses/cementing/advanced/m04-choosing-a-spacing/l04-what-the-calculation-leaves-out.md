# What the calculation leaves out

Five omissions, and the engine names the first one itself.

{{panel:cm-standoff-explorer}}

## One, tension times dogleg

From the engine's own header:

    The tension x dogleg lateral-load term is deliberately out of v1 (stated).

A string in tension being pulled through a curve presses against the outside of the curve with a force proportional to the tension and the curvature. In a build section that force can exceed the weight component.

And it acts exactly where the standoff is already worst, because the build section is where the inclination is rising and the string above it is heavy.

So the reported standoff in a build is optimistic, and the engine says so rather than leaving it to be discovered.

## Two, casing movement

Rotation or reciprocation during the job. Not a standoff term at all: it does not centre the pipe, it moves the narrow side around so no part of the annulus is permanently starved.

It is the most effective mud removal technique there is and nothing in this course represents it.

## Three, the pipe's own curvature

Casing is not straight. A joint has a residual bow from manufacture and handling, and the string follows the hole, which is not straight either.

The beam model assumes a straight pipe between two supports.

## Four, cuttings beds

On a deviated well the low side of the hole has a bed of cuttings on it, which the casing lands on rather than on the rock. That raises the pipe, which sounds helpful, and it also means the narrow side of the annulus is full of solids rather than mud.

The Hole Cleaning module of the hydraulics course computes the bed. Nothing connects the two.

## Five, the centralizer's own drag

A bow spring pressing on the wall generates friction as the casing is run, and enough of them can stop a string reaching bottom. That is a running problem rather than a standoff one, and it is a real constraint on how many can be fitted.

The Torque and Drag course computes casing running loads and does not know about the centralizers either.

## What is left

A rigorous static calculation of where the pipe sits between two supports under its own buoyed weight in a straight hole with the string not moving.

That is a real and useful answer and it is the standard one, and every one of the five omissions above makes the real standoff different from it.

## Which direction

Tension times dogleg makes it worse. Cuttings beds make it better and the annulus worse. Residual curvature could go either way. Casing movement does not change the standoff and improves the outcome anyway.

So the reported number is not conservative in a stated direction, which is the least comfortable kind of approximation.

## Exercise

Of the five omissions, name the one the engine documents in its own header.

Then say which two of the other four would be worth adding first, and what each would need as an input.
