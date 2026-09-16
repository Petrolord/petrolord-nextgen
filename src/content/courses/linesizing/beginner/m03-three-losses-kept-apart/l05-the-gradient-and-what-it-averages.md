# The gradient, and what it averages

The gradient is the total loss divided by the length. On the level OGBIA line it is 0.0009719936 psi per ft.

{{panel:fc-liquid-explorer}}

## One number for the whole line

| elevation change ft | total psi | gradient psi per ft |
| --- | --- | --- |
| 0.000000 | 25.660631 | 0.0009719936 |
| 420.000000 | 184.618965 | 0.0069931426 |
| -420.000000 | -133.297702 | -0.0050491554 |

The gradient is convenient because it is comparable. Two lines of different length can be judged against each other, and a route can be costed by the mile of pipe it needs.

## It puts back together what the engine kept apart

The three losses were returned separately for a reason, and the gradient divides their sum. So the tilted rows carry friction and a static column mixed into a single figure, and nothing in that figure says which of the two is doing the work.

Compare the level row with the uphill row. Both describe the same pipe carrying the same crude at the same velocity, and their gradients are 0.0009719936 and 0.0069931426 psi per ft. Every bit of that difference is the hill.

## The sign is doing real work

The downhill gradient is negative, which says the line gains pressure along its length. A gradient quoted without its sign, or taken as a magnitude, turns a line that arrives strong into a line that arrives weak.

## Where an average is the wrong shape of answer

A gradient is an average over the whole length. On a line with a uniform slope that average describes the pipe honestly at any point along it. On a line that climbs and then descends, the same average is the arithmetic of the two ends, and the pressure at a point in the middle is a separate question this number does not answer.

That separate question is what a marched profile is for, and it belongs to a later tier. The habit to carry now is to ask whether a gradient is describing a line or summarising one.

## On the level line the gradient is friction alone

The level OGBIA row returns 25.660631 psi of friction, 0.000000 psi of fittings and 0.000000 psi of elevation. Its gradient of 0.0009719936 psi per ft is therefore the friction term and nothing else, which is what a gradient describes when the other two terms are zero.

Add a fitting list or a slope and that stops being true, while the number still prints in the same units and still looks like the same kind of quantity.

## The mistake

Sizing a long route from a gradient measured on a tilted section. The friction part scales with length and the elevation part does not, so extending the pipe extends only one of the two terms inside the average.

## Exercise

Give the gradient on the level line and on the 420.000000 ft climb, and say what the whole of the difference between them is. Then say what a negative gradient means, and name the question an average gradient cannot answer.
