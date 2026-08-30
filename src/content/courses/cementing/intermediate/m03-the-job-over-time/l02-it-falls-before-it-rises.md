# It falls before it rises

The most useful diagnostic on a cement job, and why it works.

{{panel:cm-placement-explorer}}

## The claim

On any job where the cement is denser than the mud it displaces, and where the top of cement is below surface, the pump pressure MUST fall first and rise later.

That is not a property of these numbers. It is a property of the geometry, and it follows from the U-tube expression in two lines.

## The two lines

At the start, both columns are mud and the two heads cancel, so the pressure is pure friction.

Pump a cubic metre of cement. It goes into the INSIDE, replacing a cubic metre of mud there. The inside head goes UP by the density difference times the vertical height of that cubic metre. The annulus is untouched.

    d(pump pressure) = -d(inside head) < 0

So the first cubic metre lowers the pressure, and so does every one after it, until cement starts arriving in the annulus.

## And the reverse afterwards

Once the annulus is taking cement, each additional cubic metre adds to the annulus head and the sign flips.

The minimum is exactly where the two effects balance, and after it the pressure climbs monotonically to the end.

## Why this makes a good diagnostic

Because the fall is not optional. A job whose surface pressure does NOT fall in the first third is a job where the cement is not going down the casing, and there are only a few reasons for that.

**A plug is stuck.** The bottom plug did not burst at the float collar.

**The cement did not go in.** A mixing failure at surface, so what is being pumped is not what was planned.

**The geometry is not what you thought.** The casing is not as deep, or the bore is not as computed.

All three are found by watching for a fall that does not come.

## The magnitude is a check too

The size of the fall is the density difference times the vertical height of the cement column inside the casing. On this job that is a factor of nine from 5517762.999844827 down to 589724.8510166854.

A fall that is much smaller than predicted, with the right shape, points at a lighter cement than intended.

## What the model gets wrong here

The real minimum is softer than this one, because real interfaces are mixing zones rather than faces. Plug flow gives a sharper turn than a chart will show.

## Exercise

The horizontal well's two-slurry job starts at 5144217.329245441 Pa and reaches its minimum of 116697.07034800947 at 28.911785008515537 cubic metres.

Compute the ratio, compare it against the slant well's, and say which well has the deeper fall and why the true vertical depths explain it.
