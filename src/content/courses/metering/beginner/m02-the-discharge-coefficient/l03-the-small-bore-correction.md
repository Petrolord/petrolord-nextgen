# The small bore correction, and where it turns on

Below a pipe bore the correlation treats as small, the equation carries an extra
term. This lesson is about that term, and about how you find where it starts
when the source code is not in front of you.

## Bisecting a flag rather than reading a number

The engine returns a flag saying whether it applied the small bore term. That
flag is the honest way to find the threshold. You ask the engine at one bore,
ask it at another, and keep halving the gap between a bore where the flag is
true and a bore where it is false until the two meet:

   the correction is applied below a pipe bore of, in             2.800000

Found by bisecting the engine's own `smallBoreCorrectionApplied` flag. Nothing
was read out of the source and nothing was typed. The threshold is a property of
the engine that the engine itself reported, which means it stays true if the
engine is rebuilt and it becomes false loudly if the engine changes.

## The bores either side

| pipe bore, in | coefficient | correction applied |
| --- | --- | --- |
| 1.049000 | 0.607340 | true |
| 2.067000 | 0.604875 | true |
| 2.469000 | 0.603886 | true |
| 2.800000 | 0.603040 | true |
| 3.068000 | 0.603075 | false |
| 4.026000 | 0.603134 | false |
| 6.065000 | 0.603149 | false |
| 10.020000 | 0.603172 | false |

Every row is at the same beta and the same Reynolds number, so the only thing
changing down the column is the bore.

## What the step is worth

   at a bore of 2.800000 in, where the correction is applied             0.603040
   at a bore of 3.068000 in, where it is not                  0.603075
   difference (first less second)                     -0.000036
   ratio (first over second)                           0.999941

That comparison was computed at beta 0.500000 and Reynolds 1e+6, and it is the
only statement about the size of this step you are entitled to make. The point
of a correction like this one is that a small pipe is not a scaled down large
pipe. The plate edge, the tapping holes and the wall roughness are all a larger
fraction of the bore, and the correlation carries a term to say so.

## Why you care on a live run

Two reasons. The first is that a run at 2.800000 in and a run just above it are
being evaluated by slightly different arithmetic, so a set of meters of mixed
size is not internally consistent in the way people assume. The second is that
the flag is on the result. If you are reviewing somebody's calculation of a
small line, the flag tells you whether the extra term was in play, and that is a
question you can answer in one glance rather than by reading their spreadsheet.

## Exercise

The bore of 6.065000 in appears in this table and also on the ABOH run sheet.
Say what the flag on the ABOH result must have been, and how you know without
running anything.
