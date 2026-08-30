# A string in compression

What a negative tension means, and why the model keeps going anyway.

{{panel:td-buckling-explorer}}

## The situation

Every operation that puts weight on bit puts the bottom of the string into compression. Every operation that runs a string into a horizontal hole puts a length of it into compression too, because friction resists the descent and something has to push.

The model handles both the same way: tension goes negative and the recursion carries on.

## Why that is a problem

A column in compression is a fundamentally different mechanical object from a rope in tension.

A rope in tension has one stable configuration: straight, along the line of the force. A column in compression has a stable straight configuration only up to a load, and past it the straight configuration becomes unstable and the column deflects sideways.

That is buckling, and for a drill string in a hole it happens in two stages.

## The two stages

**Sinusoidal.** The pipe lies in a wave along the low side of the hole, alternating from one wall to the other. It is still passing load along, and the extra contact it makes raises the friction.

**Helical.** The pipe wraps around the inside of the hole in a spiral. Now it presses OUTWARD everywhere, the contact force jumps, and the friction with it.

Once helical, adding more push at surface produces more wrap rather than more load at the bit. That is lock-up.

## What the model does about it

It computes both limits at every point and flags where the compression exceeds them. It does NOT change the friction.

That is a deliberate and important limitation. A buckled string has more contact force than a straight one, so its friction is higher, so the real hookload is worse than the model says. The model's numbers past the buckling threshold are optimistic.

## The vertical case, which surprises people

In a vertical hole both buckling limits are ZERO.

The limit expression has sin(inclination) in it, because what resists buckling is the pipe's weight holding it against the low side. In a vertical hole there is no low side, so nothing resists, and any compression at all buckles the pipe.

That is why the vertical well in this course flags buckling from 1940 m while rotating on bottom, and why drill collars exist: they are stiff and heavy enough that the buckling they experience does not matter.

## The reading

A buckling flag is not a failure. It is a statement that the friction numbers below that depth are underestimates, and the further past the limit, the worse the underestimate.

## Exercise

Find the depth of the neutral point on the vertical well rotating on bottom, and confirm the buckling flag sits at the same depth.

Then say why a flag at the neutral point is expected in every vertical well and carries no information at all.
