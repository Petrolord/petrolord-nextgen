# How short is short

The shortfall between the depression a dose was sized for and the depression its own check reports is not a fixed penalty. It is zero below one concentration and grows steadily above it.

{{panel:pd-hydrate-explorer}}

## A sweep with only one thing moving

These are sweep points, not published cases. The produced water rate and the lean strength are held at TEACHING LINE AKASO SPUR values throughout and only `neededDepressionF` moves. Methanol.

| Need, degF | Sized, weight percent | Delivered, degF | Basis | Shortfall, degF | Shortfall, percent |
| --- | --- | --- | --- | --- | --- |
| 15.0 | 17.0691859639 | 15.0000000000 | hammerschmidt | -0.0000000000 | -0.000000 |
| 20.0 | 21.5337052221 | 20.0000000000 | hammerschmidt | 0.0000000000 | 0.000000 |
| 25.0 | 25.5420918367 | 22.8576327543 | nielsenBucklin | 2.1423672457 | 8.569469 |
| 30.0 | 29.1608518901 | 26.9823691235 | nielsenBucklin | 3.0176308765 | 10.058770 |
| 35.0 | 32.4441615554 | 30.9798680083 | nielsenBucklin | 4.0201319917 | 11.486091 |
| 41.0 | 36.0035520084 | 35.6195882812 | nielsenBucklin | 5.3804117188 | 13.122955 |
| 50.0 | 40.6908813818 | 42.2818508589 | nielsenBucklin | 7.7181491411 | 15.436298 |
| 60.0 | 45.1543195377 | 49.3036127042 | nielsenBucklin | 10.6963872958 | 17.827312 |

Every row returns `ok: true`. The minus sign on the first row is floating point noise on an exact inversion, not a design that over-delivers.

## The row that is not a round step

41.0 degF is in that ladder because it is the teaching line's own need, 36.00 degF of shut-in subcooling plus a 5.00 degF margin. Dropping it because it spoils the spacing would hide the one row a reader can tie to a line.

## Where the step comes from

Between 20.0 and 25.0 degF of need the sized concentration crosses 25.0 weight percent, moving from 21.5337052221 to 25.5420918367. That crossing changes `basis`, and the shortfall goes from reading as zero to 2.1423672457 degF in a single row. Nothing about the chemistry stepped. The reporting rule stepped.

## The direction never changes

The shortfall is positive on every row above the crossing and it never comes back. Between 25.0 and 60.0 degF of need it more than doubles in percent terms, from 8.569469 to 17.827312, because the ratio between the two relations widens with concentration and the sizing relation is the higher of the two. A design in this region is always short, never long, and the deeper the subcooling the shorter it is.

## The mistake

Reading a small percent as a small consequence. At a 30.0 degF need the shortfall is 3.0176308765 degF on a design whose whole safety margin may be smaller than that. Percentages of a depression are not percentages of a margin, and a hydrate verdict is decided on the margin.

## Exercise

Run the requirement at needs of 20.0, 25.0 and 30.0 degF and record the sized concentration, `basis` and `recommendedF` at each.

Then say which two rows share a `basis`, what the shortfall reads on the row below the crossing, and why that reading is not evidence the dose was checked.
