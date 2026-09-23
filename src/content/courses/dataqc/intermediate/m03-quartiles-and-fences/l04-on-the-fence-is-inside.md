# On the fence is inside

{{panel:dq-outliers-explorer}}

Every statistical flag in this engine fires strictly beyond its limit. A value exactly on a Tukey fence is inside, and a value exactly on a Hampel threshold is inside. The Associate checks drew the boundary on purpose in three places: an exclusive definitional minimum flags the bound itself, so a resistivity of 0 fails; a frozen run includes a value exactly at its tolerance; and a step exactly equal to maxStep in coverage covers.

The golden case the engine is checked against, `iqr-exactly-on-both-fences`:

| what | value |
| --- | --- |
| values, stated | -4, 2, 2, 3, 4, 5, 6, 6, 12 |
| settings | the defaults, rule R7 and k 1.5 |
| Q1, Q3 and IQR | 2, 6 and 4 |
| lower fence | -4 |
| upper fence | 12 |
| entries flagged | 0 |

## Reading the case

The series is built so that its smallest value, -4, lands exactly on the lower fence and its largest, 12, exactly on the upper fence, at the defaults. Neither is flagged. A fence is the last value still inside, and a flag needs a value strictly beyond it.

## Why strictly beyond

A boundary has to belong to one side, and either convention can be defended. The engine chose strictly beyond for every statistical flag, so no reader of a statistic has to remember which rule includes its boundary. The same sentence describes the z-score threshold, the modified z threshold, the Tukey fences, the Hampel threshold and the Mahalanobis cutoff.

The practical effect is small on real data, where a measured value rarely lands exactly on a computed fence. It matters on data written to a coarse resolution, where many values share a few levels and a fence can fall on one of them. It also matters when a figure is reproduced by hand, because a reader who assumes the other convention will count one flag too many whenever a value sits on the line.

## The Hampel threshold behaves the same way

Module four has its own golden case, `hampel-on-the-threshold`: the values -1, 0, 1.482600, 1, 0 with halfWindow 2 and nSigma 1. Entry 2 sits exactly on its threshold of 1.482600 and is not flagged. The next module explains that threshold.

## Where the fence lands depends on the rule

Whether a value sits on a fence, just inside it or just outside it depends on the quartile rule as well as on k. The first lesson of this module showed R6, R7 and R8 giving different quartiles on the same seventy samples. On a short series a change of rule can move a fence past a value, so a flag at the boundary should always be reported with the rule that produced it.

## What to report

For a value near a fence, report the value, the fence and the setting together, and say that the rule is strictly beyond.

## Exercise

Open the explorer's fences view and type -4, 2, 2, 3, 4, 5, 6, 6, 12. At R7 and k 1.5, confirm the fences of -4 and 12 and that no entry is flagged. Then raise the last value a little above 12 and run it again. Say whether the upper fence moved, and whether the new value is flagged, and explain your answer in one sentence using the strictly beyond rule.
