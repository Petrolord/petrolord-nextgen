# Height from pit gain

The first inference, and the assumption inside it.

{{panel:wc-killsheet-explorer}}

## The expression

    influx height = pit gain / annulus capacity at the bit

A volume divided by an area gives a length.

## The numbers

On both wells, whose annulus capacity at the bit is 0.013522756 m2:

| pit gain | influx height |
|---|---|
| 1.5 m3 | 110.9241353474464 m |
| 3.0 m3 | 221.8482706948928 m |

A hundred metres of influx from one and a half cubic metres. That is what a tight annulus does.

## The three assumptions

**That the influx is at the bottom.** It is, at shut-in, if it entered through the bit and has not migrated. Gas migrates, so the assumption expires with time.

**That it occupies the full annulus cross section.** A single continuous column with mud above it and nothing below.

**That the capacity at the bit applies over the whole height.** If the influx is tall enough to reach above the collars, part of it is in a wider annulus and the height is less than the division gives.

## When the third one breaks

The collars are 150 m long in this course. An influx of 221.85 m is taller than the collar section, so part of it is in the heavy weight annulus, which is wider.

So the computed height is an OVERESTIMATE for the larger of the two scenarios, and the engine does not correct for it.

That is a real and stated simplification. It makes the influx look taller than it is, which makes the density deficit look larger, which makes the influx look lighter than it is.

## Why the error goes that way

A taller influx spread over the same pit gain means a lower density is needed to produce the same pressure difference. So the bias is toward calling the influx lighter, which is the conservative direction for interpretation and the wrong direction for accuracy.

## The measurement underneath

The pit gain. It is read off the active system's level, and its accuracy depends on how well the tanks are calibrated, whether anything else was being added, and how steady the level was.

An error of a few tenths of a cubic metre is ordinary, and on a 1.5 m3 gain that is a large fraction.

## Exercise

Compute the influx height for pit gains of 1.0, 2.0 and 4.0 m3 at the bit capacity.

Then say at which pit gain the influx first becomes taller than the 150 m collar section, and what that does to the calculation.
