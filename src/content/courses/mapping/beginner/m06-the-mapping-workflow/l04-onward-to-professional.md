# Onward to Professional

This tier taught one surface. You assembled six control points, chose a frame and a 100 m cell, gridded with a thin-plate spline, masked at 800 m to leave 201 live nodes of 500, contoured at 10 m and read numbers off the result, including a crest of 1539.72 m and a depth of 1542.62 m at P-1.

That is a complete skill, and it is deliberately narrow. The two tiers above it widen it in two specific directions, and it is worth knowing what they are before you decide whether to climb.

## Professional: two-surface mathematics

The Professional tier stops treating a map as an end product and starts treating it as an operand.

The Ekene wells carry a second pick, BASE_SAND, in the same six wells. Grid it on the same frame, with the same cell size, the same method and the same extrapolation limit, and you have two surfaces that are node for node comparable. Subtract the top from the base and the difference is a new grid: an isochore, a map of thickness rather than depth.

Everything you learned about the first surface applies to the second, and a few things only appear when there are two. The frames must match exactly, because subtracting grids with different origins or cell sizes is meaningless. The masks interact, since a node is only live in the isochore if it was live in both inputs. And the thickness map has its own statistics and its own crest, which is now a thick spot rather than a high.

The lesson the tier is really built around is what happens when you compare the mean of the thickness map against the plain arithmetic mean of the six well thicknesses. Those two numbers are both honest averages of the same rock, and they are not the same number. The well mean weights each well equally. The map mean weights each node equally, so it is really weighting by area, and the area each well controls is set by the well spacing and by where the mask happens to fall. The gap between the two is not an error in either. It is what gridding does to averages, and it is the first thing that matters when a map starts feeding a volume calculation.

## Expert: validation

The Expert tier asks a question this tier could not: is the map any good?

The first tool is leave-one-out cross validation. Drop one well from the control set, grid the remaining five, and ask the resulting surface to predict a depth at the location of the well you removed. The residual, predicted minus actual, is a measurement of the map's predictive skill at a place where you happen to know the truth.

On this geometry the technique runs into an honest limitation, and the course says so rather than hiding it. The gridder masks to the control, so when you remove a well on the outside of the well pattern, the location you want a prediction for now falls outside what the five remaining wells constrain, and there is no value there to compare. Only a well sitting inside the hull of the others can be dropped and still predicted. On Ekene that is Ekene-6 alone, so the honestly cross-validatable count is small. This is a normal condition for a small field, and it is a better outcome than reporting six residuals of which five were quietly extrapolated.

The second tool is the blind test, which is the only unambiguous one. A new appraisal well, Ekene-7, is drilled inside the field. The map built from the original six wells already carries a prediction at that location. Compare the prediction against the pick, and you have a single number that no amount of methodology can argue with. Then add the new well to the control set and see how the map changes, which tells you how much of the previous map was data and how much was assumption.

## The shape of the ladder

Put the three tiers in one line and the progression is clean. The beginner builds a map and reads it. The professional combines maps. The expert tests whether the map predicts.

Notice that each tier makes the previous one more demanding rather than replacing it. Combining two surfaces means both must be built with the same care described in the quality control lesson. Validating a map means every choice made in the workflow, the cell size, the method, the extrapolation limit, becomes something with a measurable consequence rather than a matter of taste.

The same widening applies sideways, across courses. Mapping does not begin with the picks; correlation produces them, and the well correlation course is where the six TOP_SAND picks used here came from. A pick that is wrong on the section is wrong on the map, and no gridding decision will find it. Mapping does not end with the map either. Volumetrics consumes it, taking the depth surface, the isochore built above it and a contact to produce rock volume, and every honest blank left by the 800 m mask propagates into that calculation as an area the volume does not claim.

That is the chain: correlation feeds the picks in, mapping turns them into a surface, volumetrics turns the surface into a number a decision can rest on. This course was the middle link, and it is the one where the honesty of the whole chain is easiest to lose.

## Exercise

Write one sentence for each tier saying what it does that the tier below it cannot. As a self-check: the beginner tier builds a single masked, contoured surface and reads values off it; the professional tier grids a second surface on the same frame and subtracts to produce an isochore, then compares mapped statistics against well statistics; the expert tier measures predictive skill by leave-one-out cross validation and by a blind test at a new well. Then answer in one sentence: why can only Ekene-6 be cross validated on this control set? Because it is the only well inside the hull of the others, so removing it still leaves its location within the area the remaining five wells constrain.
