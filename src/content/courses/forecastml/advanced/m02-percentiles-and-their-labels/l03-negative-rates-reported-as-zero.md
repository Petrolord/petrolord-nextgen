# Negative rates reported as zero

{{panel:pf-uncertainty-explorer}}

A smoothing method knows nothing about the physics of a well, and a simulated path can run below zero. The engine leaves the paths alone and changes what it reports: with `nonNegative` true, the default, a percentile below 0 is reported as 0 and counted.

## The rule, in the engine's words

The basis reads:

> a negative percentile is reported as 0 (clippedToZero counts them)

The rule acts on percentiles after they are read from the sorted paths, so the paths are simulated in full. A percentile at or above 0 is reported as simulated, and `clippedToZero` counts the ones changed, so a 0 in the table never passes unannounced.

## EKENE-P5, the steep decline

EKENE-P5 declines steeply to a low tail, its last month 11.100000 bbl/d. Holt fitted on it ends on a negative trend, and its straight-line point forecast crosses zero between step 16 (0.078646) and step 17 (-0.623541). Holt on EKENE-P5, h 12, seed 11: 11 of the 36 percentiles (three per step, 12 steps) are reported as 0. The last three steps, both ways:

| step | P90, nonNegative true | P90, nonNegative false | P50, nonNegative true | P50, nonNegative false |
| --- | --- | --- | --- | --- |
| 10 | 0.000000 | -53.846650 | 101.499145 | 101.499145 |
| 11 | 0.000000 | -54.233366 | 120.696727 | 120.696727 |
| 12 | 0.000000 | -58.408958 | 138.941534 | 138.941534 |

Only the negative percentiles change. The P50 column is identical both ways, because the P50 at those steps is above 0. Notice how far apart the columns sit: the P90 (low) is below zero while the P50 climbs, and holt's own point forecast falls toward its zero crossing at step 17. The point forecast is never clipped: holt's line is returned as computed, below zero where it goes there.

## What a reported 0 says

A P90 (low) reported as 0 says that at least a tenth of the paths fell below zero at that step. Read it as the method's paths running out of rate, and read it as a warning about the method on that well. It is not a forecast of a shut-in, and it is not a rate the engine measured.

The same happens on the teaching run, damped on EKENE-P1, seed 11, 1000 paths. Its P90 (low) is reported as 0.000000 from step 10 to step 12, even though the damped point forecast at step 12 is 169.556510. The paths carry every earlier draw, and by step 10 the low tenth of them has run below zero.

## When to turn it off

Turn `nonNegative` false when you need the percentile as simulated: to see how far below zero the paths went, or to compare with another tool that does not clip. Leave it true when the figure is going into a report of rates, and say in the note how many percentiles were reported as 0. Either way the paths are the same; only the reported percentiles differ.

The switch is a strict true or false. A word in its place is refused, naming the field `nonNegative`:

> nonNegative must be true or false

## Exercise

Open the view "Seeds, paths and clipping" with EKENE-P5, method holt, h 12 and seed 11. Run it with nonNegative true and read the count reported as 0. Switch nonNegative to false and read the P90 at step 12. Then set h to 6 and to 24 in turn, with nonNegative true, and write down how the count reported as 0 changes and what it says about holt's paths on this well.
