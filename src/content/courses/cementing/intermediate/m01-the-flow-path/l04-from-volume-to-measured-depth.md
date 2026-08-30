# From volume to measured depth

Two maps, and the annulus one runs backwards.

{{panel:cm-placement-explorer}}

## Why two

Because the two legs have different capacity structures and run in opposite directions.

The INSIDE leg has one capacity and runs from surface down. The ANNULUS leg has a row per section and runs from the shoe up.

## The inside map

    md = v / capInside

Applied to the part of each fluid interval that falls in [0, vInside]. The segments come back sorted by depth, and each carries the fluid that occupies it.

## The annulus map

Walk the rows from the SHOE upward, accumulating a running volume that starts at vInside. Within a row,

    md = row.toMd - (v - rowStartVolume) / row.capM2

The minus sign is the whole difference: volume increases as you go UP the annulus, so depth decreases.

The two ends of an interval therefore swap: the smaller volume is the DEEPER depth. The engine names them accordingly and sorts the segments by depth afterwards.

## What each annulus segment carries

    { fromMd, toMd, fluid, boreIdEffM, capM2 }

The bore and the capacity come along, because the friction term needs them and they differ per row. An inside segment needs neither, because the inside is one size.

## Why the segments are re-derived at every step

The engine recomputes the intervals and both maps at each of the 61 pumped volumes, from scratch. There is no state carried from one step to the next.

That is slower than advancing a state, and it is correct by construction: there is no way for a rounding error to accumulate, because nothing accumulates.

## The end state

At the last step the annulus segments are exactly the finished cement column, and the engine reports them:

    annulusEnd -> [{ fromMd, toMd, kind, densityKgM3 }, ...]

On the slant well's two-slurry job that is mud from surface to 900.5245622082865 m, spacer from there to 1200, lead from 1200 to 1400, and tail from 1400 to 3000.

The top of the tail is exactly the previous casing shoe and the top of the lead is exactly the target top of cement, which is the programme working as designed.

## Exercise

The slant well's annulus rows are 0 to 1400 at 0.013356688045922537 and 1400 to 3000 at 0.013548091222369345.

Starting from vInside at the shoe, compute the volume coordinate at which the annulus map returns 1400 m, and then the coordinate at which it returns 1200 m.
