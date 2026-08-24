# The prediction before the pick

One of the six capstone fields is the six-well map's prediction at Ekene-7. This lesson reads it, checks it against its neighbours, and explains why it is the number it is.

{{panel:mp-validation-explorer}}

## Reading it

Set the panel to **all six wells**. That is the map as it existed before the appraisal well.

Sample it at (1500, 1500) and it returns **1543.3271484375 m**. The capstone grades that to 0.1 m.

Read it in that panel state and record it before touching the selector. Once the seven-well setting is chosen the map honours Ekene-7 exactly and this number is no longer on the screen.

## Sanity-checking the prediction

Compare it with the nearby control.

| | Depth |
| --- | --- |
| Ekene-3, 806 m away | 1541 |
| Ekene-6, 500 m away | 1546 |
| Ekene-1, 707 m away | 1548 |
| **Prediction at Ekene-7** | **1543.33** |
| Ekene-5, 985 m away | 1552 |

The prediction sits between its two nearest wells, closer to the shallower one. Nothing about it is unreasonable: a minimum-bending surface between 1541 m, 1546 m and 1548 m at those distances lands naturally in the low 1540s.

Note also that the prediction is **shallower than every one of its three nearest wells except Ekene-3**. That is the spline doing what module 2 warned about in the other direction: interpolation between scattered control can produce values outside the local range of the nearest points, because the fit responds to the whole set and to its own bending penalty.

## Where the prospect sits relative to it

P-1 at (1600, 1600) is 141 m from Ekene-7 and the six-well map reads **1542.619873046875 m** there.

So the map places P-1 and Ekene-7, 141 m apart, at 1542.62 m and 1543.33 m, a difference of 0.71 m. The map believes the horizon is essentially flat across that gap, which is exactly the kind of claim a blind test is about to examine.

## What the prediction is worth before the well

Two things can be said about it in advance, and it is a good exercise to say them before the answer is known.

**It is an interior interpolation from three wells within 810 m.** That is as well constrained as anything on this map gets. If a prediction anywhere is going to be good, this one should be.

**It carries no uncertainty.** The map produces one number and offers no spread. The only quantitative guide available before the well is the leave-one-out residual at Ekene-6, which is $+9.84$ m at a location 707 m from its nearest control. Ekene-7 is 500 m from its nearest control, closer, so a smaller error might be expected.

Writing both of those down before the pick is what turns the blind test from an anecdote into a test of an expectation.

## Worked example

Predict, before reading the next lesson, whether the residual at Ekene-7 will be positive or negative, and give a reason either way.

An argument for **positive**: the leave-one-out residual at the only other testable interior point was positive, so if the map has a tendency to read deep in the interior, this one should too.

An argument for **negative**: the prediction of 1543.33 m is shallower than two of its three nearest wells, which suggests the spline is overshooting shallow here, and an overshoot shallow means the real pick will come in deeper and the residual will be negative.

Both are reasonable and only one is right. Making the call before looking is the point of the exercise, and the second argument is the better one because it reasons from this location rather than from a different one.

## Exercise

State the six-well prediction at Ekene-7 and the panel setting it must be read in, then explain in one sentence why the prediction sits shallower than two of its three nearest wells.

As a self-check: the prediction is 1543.3271484375 m, read with the panel on the all-six-wells setting, before Ekene-7 is added to the control. It sits shallower than Ekene-6 at 1546 m and Ekene-1 at 1548 m because a thin-plate spline minimises bending across the whole control set rather than averaging its nearest neighbours, and the shallow ground at Ekene-3 to the northwest pulls the fitted surface above the level the two nearest wells alone would imply.
