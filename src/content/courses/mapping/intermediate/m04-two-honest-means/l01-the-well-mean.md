# The well mean

One of the six capstone fields involves no map at all. This lesson is about that number: what it is, what it is good for, and why it is graded to a tighter tolerance than anything gridded.

## The number

Take the six wells, subtract each one's top pick from its own base pick, and average the six results.

$$\frac{32 + 36 + 29 + 25 + 31 + 34}{6} = \frac{187}{6} = 31.166666666666668\ \mathrm{m}$$

That is the whole calculation. No frame, no spline, no mask, no cell size.

## Why the tolerance is tighter

The capstone grades this field to 0.05 m, half the 0.1 m allowed on the four gridded thickness fields.

The reason is that there is nothing in it to be uncertain about. The picks are exact integers, the subtraction is exact, and the division by six is exact to the precision of a float. Any answer other than 31.1667 comes from an arithmetic slip or from averaging the wrong six numbers, not from a modelling choice.

The gridded fields carry a wider tolerance because they depend on the interpolator, the mask and the node placement, and a learner working carefully can still land a little away from the panel's figure. This one they cannot.

## What it is good for

**It is the honest summary of what has been measured.** Six wells penetrated this interval and the average of what they found is 31.17 m. That statement needs no assumptions and survives any change of mapping method.

**It is the reference the map is checked against.** A map mean far from the well mean is worth understanding before it is used. A map mean identical to the well mean would also be worth understanding, and on real control it almost never happens.

**It is the number to quote when the map is not trusted.** Early in a field's life, with few wells and no seismic control between them, a plain well average with its sample size attached is often more defensible than a gridded average with an implied precision the control does not support.

## What it is not good for

**It is not an estimate of the average thickness of the field.** It weights each well equally, and wells are not placed at random. They are drilled on structure, on seismic amplitude anomalies, and where the operator already believes there is reservoir. On many fields that makes the well set systematically biased toward the thicker or better parts.

**It says nothing about the area.** Six wells averaging 31.17 m tells you nothing about how much rock there is, because volume needs thickness times area and this number carries no area with it.

**It is a sample of six.** The standard error of a mean of six values with a spread of 11 m is around 1.6 m, so the true field average could comfortably be a metre and a half either side of 31.17 m on sampling grounds alone, before any question of bias is raised.

## The sample-size discipline

Quote it as *31.17 m, mean of six wells, range 25 to 36 m*, never as *31.17 m*.

The mean alone hides the spread and the count, which are the two things that decide how much weight it deserves. On this field the spread is 11 m, more than a third of the mean, so the interval genuinely varies and a single central number is a poor summary of it.

## Worked example

A seventh well is drilled and finds 40 m of sand. What happens to the well mean, and what should be said about it?

The new mean is $(187 + 40)/7 = 32.43$ m, a rise of 1.26 m from one well. The range widens from 25 to 36 into 25 to 40.

What should be said is that a single well moved the field average by more than a metre, which is a direct measurement of how unstable a mean of six is. It is also worth asking why the new well is the thickest: if it was drilled on the thickest part of the isochore, the well set has just become more biased, not more representative.

## Exercise

Compute the mean of the six Ekene well thicknesses, state the range, and give two reasons why this number is not an estimate of the average thickness of the field.

As a self-check: the mean is $187/6 = 31.166666666666668$ m with a range of 25 to 36 m. It is not an estimate of the field average because it weights each well equally regardless of how much area that well represents, so a well in a corner counts as much as a well in the middle of the field, and because wells are not placed at random but drilled where reservoir is already expected, which biases the sample toward the parts of the field that motivated the drilling.
