# The volume coordinate

One number parametrises the whole path, and it is not a depth.

{{panel:cm-placement-explorer}}

## The idea

Follow the fluid. It goes down the inside of the casing, through the float collar and the shoe, and back up the annulus to surface.

Parametrise that path by CUMULATIVE VOLUME from the start:

    v = 0            surface, inside the casing
    v = vInside      the casing shoe
    v = vInside + vAnnulus   back at surface, in the annulus

## Why volume and not depth

Because depth is not single valued along the path. At 1000 m there are two places to be: inside the casing on the way down, and in the annulus on the way up. Volume distinguishes them.

And because the pumps deliver volume. Pump one cubic metre and EVERY front on the path advances by exactly one cubic metre of path coordinate, wherever it happens to be and whatever the local capacity is.

That is the whole reason the bookkeeping is exact.

## The two legs on the slant well

    vInside  = 0.01937743444976952 x 3000 = 58.13230334930856 cubic metres
    vAnnulus = 1400 x 0.013356688045922537 + 1600 x 0.013548091222369345
             = 18.699363264291552 + 21.676945955790952
             = 40.376309220082504

The annulus rows stop at the shoe, which is where the flow path turns round, so the two legs cover the same 3000 m of casing from opposite sides. The path total is 98.50861256939106 cubic metres.

## And the job pumps less than that

The slant well's total pumped is 86.48058691428402 cubic metres, which is less than the path length of 98.50861256939106.

That is correct and it is the design: the last of the mud is still in the annulus at surface when the job ends. If the job pumped a full path volume, the cement would have come back to surface.

## Converting back to depth

Two different maps, one per leg.

**Inside**, the capacity is constant, so it is a division:

    md = v / capInside

**In the annulus**, the capacity changes at the section boundary, so the engine walks the rows from the shoe upward, accumulating volume, and converts within each row:

    md = row.toMd - (v - rowStartV) / row.capM2

That walk is the only reason the annulus needs to be a list rather than a number.

## Exercise

Compute the volume coordinate of the previous casing shoe at 1400 m, measured along the ANNULUS leg from the shoe upward, and then add vInside to get its position on the path.

Then say how much has to be pumped before the first cement front reaches it.
