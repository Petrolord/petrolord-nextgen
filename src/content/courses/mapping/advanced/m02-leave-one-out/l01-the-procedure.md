# The procedure

This lesson runs leave-one-out on the Ekene control set and reports what came back, before explaining any of it. The explanation is the next two lessons; this one is the result.

{{panel:mp-validation-explorer}}

## The runs

Six runs, one per well. Each removes that well, grids the remaining five on the same frame with the same 100 m cell and the same 800 m limit, and samples the result at the removed well's own coordinates.

| Removed | Live nodes | Nearest remaining control | Prediction | Residual |
| --- | --- | --- | --- | --- |
| Ekene-1 | 144 | 984.9 m (Ekene-5) | blank | none |
| Ekene-2 | 130 | 715.9 m (Ekene-6) | blank | none |
| Ekene-3 | 183 | 707.1 m (Ekene-6) | blank | none |
| Ekene-4 | 133 | 989.9 m (Ekene-6) | blank | none |
| Ekene-5 | 155 | 894.4 m (Ekene-3) | blank | none |
| Ekene-6 | 201 | 707.1 m (Ekene-3) | 1555.8438720703125 | $+9.8438720703125$ |

Five blanks and one number.

## The two things to notice

**The live node count collapses when a well is removed, except once.** Removing Ekene-1 drops the map from 201 nodes to 144, removing Ekene-2 to 130, and removing Ekene-4 to 133. Removing Ekene-6 leaves it at 201, unchanged.

**The one well that keeps the map intact is the one that can be predicted.** That is not a coincidence, and it is the same fact stated twice. The next lesson takes it apart.

## The one residual

The five-well map, built without Ekene-6, predicts 1555.8438720703125 m at (1900, 1800). Ekene-6 actually found TOP_SAND at 1546 m.

$$\text{residual} = 1555.8439 - 1546 = +9.8439\ \mathrm{m}$$

Positive, so the five-well map put that horizon nearly ten metres **too deep**. The real horizon is shallower than five wells could see.

Ten metres is not a small number on this field. The whole structural relief across the six picks is 49 m, so a single prediction was wrong by **20 percent of the entire relief the map exists to describe**. The map is not being asked to resolve a subtle feature; it is being asked to find a 49 m structure, and at the one place its skill can be tested it missed by a fifth of that.

## Why the residual is trustworthy

Three properties, each checked on the panel.

**It does not depend on the cell size.** At a 50 m cell the residual is 9.8438720703125 m, identical. At a 200 m cell it is 9.99969482421875 m, a difference of 0.16 m from a quadrupling of the cell area.

**It does not depend on the extrapolation limit, above a threshold.** At 800, 1200 and 2000 m the residual is identical at 9.8438720703125 m. At 400 m the prediction goes blank, because the mask no longer reaches Ekene-6's location from 707 m away.

**It is not an artefact of frame choice**, because every run uses the frame derived once from the full six-well control set.

So the residual is a property of the control geometry and the interpolator, not of the display settings. That is what makes it worth quoting.

## Worked example

A colleague runs the same exercise but derives a new frame for each five-well subset. Their residual at Ekene-6 comes out at 9.6 m rather than 9.84 m. Which is right?

The 9.8439 m figure. Deriving a new frame per subset moves the grid origin and the node positions between runs, so the sampled value at (1900, 1800) is taken from a differently placed lattice each time. The 0.24 m disagreement is the frame moving, not the interpolation changing.

The difference is small here and the principle is not: with one frame the six runs differ in exactly one thing, the control set, and any difference in the answer is attributable to it.

## Exercise

State how many of the six Ekene wells return a prediction, give the residual at the one that does with its sign and plain-English meaning, and say what fraction of the field's structural relief that residual represents.

As a self-check: one of six returns a prediction, at Ekene-6, and the residual is $+9.8438720703125$ m, positive, meaning the five-well map placed the horizon nearly ten metres too deep and the real horizon is shallower than the map predicted. The six picks span 49 m from 1541 m to 1590 m, so the residual is 20 percent of the total structural relief across the field.
