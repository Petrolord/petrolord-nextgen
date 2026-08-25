# A plane is a strong assumption

The trend model has three parameters fitted to six values. This lesson asks what that buys and what it presumes, because the presumption is larger than the parameter count suggests.

## What a plane claims

A plane says three things about the field at once.

Porosity varies monotonically. There is no maximum or minimum anywhere inside the field; the highest value is always at one edge and the lowest at the opposite one.

It varies in a single direction. The gradient is the same everywhere, so the direction of improvement at the crest is the direction of improvement on the flank.

It varies at a constant rate. Two kilometres of travel changes the porosity by twice what one kilometre does, everywhere in the field.

Depositional systems produce all three sometimes, and violate all three often. A channel belt has a maximum along its axis. A prograding shoreface has a gradient that swings with the shoreline. Compaction related porosity loss varies with depth, so its map gradient follows the structure and reverses across a crest.

## The parameter count is not the whole story

Three parameters on six values sounds conservative and the six values are weaker than they look.

Two of the six wells, Ekene-2 and Ekene-4, sit on the eastern flank within 500 m of each other in the northing sense and carry the two lowest porosities. Much of the fitted eastward gradient rests on those two. Remove either and the gradient changes materially.

The northward gradient is fitted from data that barely constrains it, since the highest and lowest porosities in the set sit at northings of 2300 and 2500 m. It comes out at 0.000769 per kilometre, which is not distinguishable from zero given the spread of the data.

So the effective information in the fit is roughly one gradient, poorly constrained, plus an intercept. That is a weaker model than three parameters implies.

## The alternative failures

It would be wrong to conclude that a more flexible model is safer.

A model with more parameters fitted to six points fits the noise. Kriging with a variogram guessed rather than fitted honours all six values exactly, which means the model can no longer be tested against the data at all: the residuals are zero by construction.

The trade is not between a strong assumption and no assumption. It is between an assumption you can state and argue with, and one that is buried in a variogram nobody chose deliberately.

That is the practical case for a plane with sparse control. Porosity improves westward at two porosity units per kilometre is a sentence a geologist can accept or reject. It is falsifiable by the next well.

## How to test the assumption

Two tests are available even with six wells.

Look at the residual pattern, as module two did. Alternating signs of similar size, which is what Ekene shows, is consistent with a fair fit. Neighbouring wells all on the same side of the plane is not.

Compare the fitted gradient with an independent expectation. If the depositional model says the sediment source was to the north west, a westward porosity gradient supports it. If the depositional model says the source was to the east, the fit and the geology disagree and one of them is wrong.

Neither test is powerful with six wells. Both are better than not testing.

## Worked example

Test the sensitivity of the trend to a single well by removing the well that carries the most leverage.

Ekene-4 sits furthest east at 2600 m and carries the lowest porosity at 0.17. Fit a plane to the other five wells, which have eastings of 1000, 2200, 1400, 600 and 1900 m and porosities of 0.22, 0.19, 0.23, 0.21 and 0.22.

Those five average 0.214. Their eastward spread is much weaker without Ekene-4: the only low value left is Ekene-2 at 0.19, and Ekene-6 at 1900 m carries 0.22, which argues against a strong eastward decline.

The refitted gradient would be considerably shallower and the intercept lower. A model in which one of six wells sets much of the gradient is a model whose gradient is an interpretation of that well.

## Exercise

State the three claims a plane makes about a property field, and name one depositional setting that violates each.

Self check: monotonic variation, violated by a channel belt with a porosity maximum along its axis; a single direction of variation, violated by a prograding shoreface whose gradient swings with the shoreline; and a constant rate of variation, violated by compaction driven porosity loss, which follows depth and therefore steepens on the flanks and flattens over the crest.
