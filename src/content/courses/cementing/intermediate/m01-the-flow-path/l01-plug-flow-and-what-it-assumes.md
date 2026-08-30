# Plug flow, and what it assumes

Sharp faces between fluids that never mix, and what that buys and costs.

{{panel:cm-placement-explorer}}

## The model

Every fluid in the string occupies a contiguous piece of the flow path with a SHARP face at each end. Mud, then spacer, then lead, then tail, then displacement, in the order they were pumped, with no mixing anywhere.

The engine's own header calls it what it is: plug flow volume bookkeeping, no intermixing.

## What it buys

**Exactness.** Given the volumes, every front position is arithmetic rather than a solution to anything. No time stepping, no numerical diffusion, no convergence.

**Reproducibility.** Two runs give the same numbers to the last bit, and an independent oracle in another language can reproduce them.

**Speed.** The whole job is 61 evaluations of a sum, which is what makes the rate sweeps in this tier possible at all.

## What it costs

**The interfaces.** Real fluid interfaces in an annulus are not faces, they are mixing zones tens of metres long, and in an eccentric annulus they are much longer on the narrow side than the wide one.

**The spacer's whole purpose.** A spacer exists to control that mixing. In this model it is a block of fluid of a given density and rheology, and its contribution is entirely hydrostatic and frictional.

**Contamination.** A slurry mixed with mud can fail to set. Plug flow says it never happens.

## Which errors it makes, and in which direction

The hydrostatic head is computed on sharp interfaces. A real mixing zone averages the densities across the interface, so the true head is between the plug-flow value and a smoothed one, and the difference is small when the interface is short compared with the column.

On a 1600 m annulus with a 30 m mixing zone, the error in the annular head is well under a percent. On a short interval it would not be.

So the model is good for a long job and poor for a short one, and this course's jobs are long.

## What it cannot do at all

Tell you whether the spacer volume is adequate. That is a mixing question, it is decided by contact time and annular velocity and the rheology contrast, and this engine has no term for it.

Four cubic metres of spacer on this job is a programme decision made outside this course.

## Exercise

The slant well's flow path holds 58.13230334930856 cubic metres inside the casing and 40.376309220082504 in the annulus.

Compute the total, and then say what fraction of the path a 30 m mixing zone in the open hole annulus would occupy.
