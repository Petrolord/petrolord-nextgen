# Which mean belongs in the booking

Three defensible averages, one booking. This lesson settles the argument and then says what to do about the two that lost.

## The answer

The volume weighted mean is the one the booking uses, and it is the only one that can be used without changing the answer.

This is not a matter of preference. The pore volume is a sum of products. There is exactly one number that, substituted for every cell's porosity, reproduces that sum, and it is the volume weighted mean by construction. Any other average gives a different pore volume, and therefore a different booking.

So the question is not which average is best. It is which average is the one already implied by the arithmetic, and there is only one candidate.

## What the other two are for

Neither is useless and neither should be discarded.

The arithmetic well mean is the reference. It is the only one of the three that is a property of the data rather than of a model, so it is what you compare a model against. A volume weighted mean far from it is a model making a strong claim, and the distance is the size of the claim.

The node mean over the oil separates two effects that would otherwise be confounded. The step from the well mean to the node mean is the selection effect, which is the oil sitting on better rock than the field average. The step from the node mean to the volume weighted mean is the weighting effect, which is the thicker cells carrying better rock. At Ekene those are 0.002701 and 0.001455, so selection is roughly twice the weighting.

Reporting all three, in order, tells the reader exactly where the model's effect came from. Reporting only the last tells them the answer and none of the reasoning.

## The error this prevents

The specific failure is quoting one average and multiplying it by the net volume.

Take the node mean, 0.209368, and multiply it by the net volume of 17.815229 million cubic metres. You get 3.729932 million cubic metres of pore space against the engine's 3.755847. Carry the difference through and it is 0.088 MMstb, understated.

That error is invisible. Both numbers are correct quantities, the multiplication is the obvious thing to do, and the result is wrong by a fraction of a percent, which is small enough to survive any sanity check and large enough to matter when compounded across a portfolio.

The defence is structural rather than vigilant. Do not average a property grid and then multiply. Sum the products and divide afterwards if you want a number to quote.

## The order is not an accident

The three means came out in increasing order at Ekene: 0.206667, 0.209368, 0.210822.

That ordering is not guaranteed, and knowing when it reverses is worth more than knowing the order.

The first step is positive when the oil sits on rock better than the mapped average. That is common, because oil sits on structural highs and highs are often better rock, but it reverses in fields where diagenesis has degraded the crest or where the best rock is in a downdip channel.

The second step is positive when porosity correlates positively with column, which again is common and again reverses in exactly the same circumstances.

So at Ekene both steps run the same way and the model adds barrels. In a field where the crest is tight, both steps would run the other way and a property model would remove barrels from the constant booking. A reader who has learned that property models increase volumes has learned the wrong lesson from a common case.

## Worked example

Work the Ekene decomposition through in the form worth reporting.

Start from the constant booking of 12.139208 MMstb at a porosity of 0.20.

Step one, use the measured well average of 0.206667 instead: 12.543848 MMstb, an increase of 0.404640.

Step two, restrict to the oil bearing cells and use the model's node mean of 0.209368: 12.707784 MMstb, a further 0.163936.

Step three, weight by rock and use 0.210822: 12.796077 MMstb, a further 0.088293.

The three steps total 0.656869 MMstb against the graded uplift of 0.656868, the last digit differing only because each step above was rounded to six decimals before adding.

Three steps, three causes, and only the last two have anything to do with spatial modelling. The next module takes that apart properly.

## Exercise

State what would have to be true of a field for the volume weighted mean porosity to fall below the arithmetic mean of its wells, and name one setting where that is expected.

Self check: the oil bearing cells would have to sit on rock poorer than the wells sampled, and the thicker cells would have to carry lower porosity than the thin ones. That happens where the crest has been degraded by diagenesis, such as a carbonate build up with tight cemented crestal facies, and it also happens where the wells were drilled preferentially into the best rock so the well set over samples the good end.
