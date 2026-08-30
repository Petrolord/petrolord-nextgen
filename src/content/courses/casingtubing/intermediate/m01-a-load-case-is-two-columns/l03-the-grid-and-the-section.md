# The grid, and the section

Where a section starts and stops, and which grid points belong to it.

{{panel:ct-loadcase-explorer}}

## A section

    { topTvdM, bottomTvdM, odM, wallM, yieldPa, connectionEfficiency }

One uniform piece of pipe over one depth range. A string is a list of them, and this course's published string has two.

| section | from | to | pipe |
|---|---|---|---|
| 1 | 0 | 1473.759701091 | 9-5/8 inch 47 lb/ft P-110, buttress |
| 2 | 1473.759701091 | 2507.919699301 | 9-5/8 inch 53.5 lb/ft L-80, long thread |

Heavier and lower grade at the bottom, lighter and higher grade at the top. That combination looks backwards until you remember that the top carries the tension and the bottom carries the collapse.

## Which grid points are inside

The evaluation walks the whole 51-point grid and skips any point outside the section, with a tolerance of a nanometre at each end so that a boundary point is not lost to floating point.

For section 1, the last grid point at or above 1473.759701091 m is index 29 at 1454.59342559458 m. For section 2, the first is index 30 at 1504.7518195805999 m.

So the section boundary itself is not a grid point, and neither section is evaluated exactly at it.

## Why that is acceptable here and not always

Because on this string the profiles are all monotone or nearly so inside each section, and the governing point is an endpoint. Missing the boundary by 19 m costs a fraction of a percent.

It would not be acceptable on a profile with a kink at the section boundary, which is exactly what a change of fluid at a casing shoe produces. A finer grid or a grid that includes the section boundaries would be the fix, and this engine does neither.

Knowing that is part of reading the answer.

## What each section carries into the check

Its own burst rating, its own pipe body yield, its own connection efficiency, and its own collapse regime, all recomputed from the section's pipe. Nothing is inherited from the section above.

## The verdict is per section

Not per string and not per depth. A string check returns one row per section with four safety factors, two governing depths, a collapse regime and a status.

Two sections and seven cases give fourteen of those rows, and the whole of module 5 is about reading them.

## Exercise

Section 1 runs from 0 to 1473.759701091 m and the grid spacing is 50.15839398602 m.

How many grid points fall inside it? Check your count against the index of its last point.
