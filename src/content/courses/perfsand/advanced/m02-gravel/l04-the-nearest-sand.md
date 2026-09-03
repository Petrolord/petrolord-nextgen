# The nearest sand

What "nearest" means, and why the definition turns out not to matter.

{{panel:ps-sand-explorer}}

## The definition

The catalog row whose median is closest to the MIDDLE of the Saucier band.

Not closest to the band, and not closest to five times the formation median or six times it. Closest to the midpoint, which is five and a half times.

## The obvious alternative

Closest to the band as an interval: distance zero if inside, otherwise the distance to whichever edge is nearer.

That sounds more natural, because it is the band that is the specification rather than its midpoint.

## Why the two give the same ranking

For any row outside the band, the distance to the band is exactly the distance to the midpoint less half the band width. Half the band width is the same constant for every row.

Subtracting a constant from every distance does not change which is smallest. So the two definitions rank identically for every row outside the band, and inside the band both definitions agree that the row matches.

That is a small piece of arithmetic worth doing once, because it converts an arbitrary-looking choice into a demonstrably harmless one.

## Where they would differ

If the band were not symmetric about its midpoint in the metric being used, or if the comparison were done on a log scale while the midpoint was arithmetic.

Neither applies here, and both are worth checking before assuming the same argument transfers to another rule.

## Why the nearest row is returned even when there is a match

Because it costs nothing and because it is a useful cross-check. If the matched row is not also the nearest row, the match is near an edge of the band, and a reader might want to know that.

On the published sand the matched row and the nearest row are the same, which is the comfortable case.

## Exercise

State the engine's definition of nearest and the obvious alternative.

Prove that the two give the same ranking for rows outside the band.

Then name a situation in which they would NOT agree, and say what to check before assuming this argument transfers.
