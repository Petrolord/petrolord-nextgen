# Onward to Expert

This tier stopped treating a map as a picture. You gridded a second surface on the same frame, subtracted the two node by node, and read a thickness map with its own extremes, its own contour interval and its own statistics. Then you found that the map's average and the wells' average are 1.09 m apart, worked out that two thirds of the gap is area weighting and the rest is the shape of the spline, and established which of the two belongs in a volume.

That is a complete skill and it has one thing conspicuously missing from it.

## Nothing in this tier tested the map

Every number produced here is a property of an interpolation. The isochore reads 34.05 m at P-1, and the only evidence for that is that a thin-plate spline through six wells says so. No part of this tier asked whether the spline is any good at predicting, or how far wrong it is likely to be at a location with no well.

The Expert tier asks exactly that, and it turns out to be answerable.

## Leave-one-out

Drop one well from the control set, grid the remaining five, and ask that surface to predict a depth at the location of the well you removed. The residual, predicted minus actual, is a measurement of predictive skill at a place where the truth happens to be known.

The technique has an honest limitation on this geometry and the tier says so rather than hiding it. The gridder masks to the control, so removing a well on the outside of the pattern leaves its own location outside what the remaining five constrain, and there is no prediction there to compare. On Ekene only one well can be dropped and still predicted, which the Expert tier quantifies rather than asserting: removing each of the five outer wells drops the live node count from 201 to somewhere between 130 and 183, while removing the one interior well leaves it at 201.

That one residual is large. Large enough that anyone who has used a map like this one without validating it will want to see the number.

## The blind test

A new appraisal well is drilled inside the field. The six-well map already carries a prediction at that location, made before the well existed, and comparing it against the pick gives a residual no methodology can argue with.

Then the new well is added to the control set, and the map is rebuilt. The differences between the two maps measure how much of the first one was data and how much was assumption. On this field the crest moves, the mapped depth at the prospect moves by several metres, and one of the changes lands in a place that will make the contour interval lesson from this tier look like a warning rather than a curiosity.

## An uncertainty you can quote

The tier ends somewhere neither of the tiers below can reach. Drop each well in turn and record the mapped depth at the prospect each time. Six control sets, six answers, and their spread is an uncertainty estimate at a location with no well, computed entirely from data you already have and available before anything new is drilled.

On Ekene that spread turns out to bracket the change the real appraisal well actually caused, which is the strongest evidence available that the method is worth running.

## What to carry up

Three habits from this tier are what make the Expert work readable.

**One frame, reused.** Validation grids the same field six or seven times over. Every one of those runs has to be on the same frame or the residuals are measuring the frame.

**Quote the conditions with the number.** Above, a residual without its cell size and mask is unusable, because both change which locations can be predicted at all.

**Say which quantity you are holding.** This tier had two honest means and a rule for choosing. The tier above has two honest residuals with opposite signs, and the same discipline decides what can be said with them.

## Where this leaves you

The Associate tier built a surface. This tier combined surfaces. The Expert tier tests whether the combination predicts anything, and puts a number on how far wrong it is likely to be.

Downstream of all three, volumetrics consumes the top surface, the isochore and the mask without rechecking any of them. The validation the Expert tier performs is the only thing standing between an interpolation and a booked volume.

## Exercise

State in one sentence what leave-one-out measures and in one sentence why it cannot be run at most of the Ekene wells. Then say what the jackknife spread at the prospect is for.

As a self-check: leave-one-out measures the map's predictive skill by removing a well, regridding without it and comparing the prediction at its location against the pick that was withheld. It cannot be run at most Ekene wells because the gridder masks to the convex hull of the control, so removing a well on the outside of the pattern puts its own location outside the area the remaining wells constrain and no prediction exists there. The jackknife spread is an uncertainty estimate at a location with no well, obtained by repeating the mapping with each well dropped in turn and recording how far the answer at that location moves.
