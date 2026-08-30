# Quoting an ellipse honestly

Five things that must accompany a semi-major axis.

## The number on its own is meaningless

"The uncertainty at total depth is 267 metres." That sentence has at least five missing pieces, and without them the number cannot be compared against anything.

## One: the confidence factor

267 at k = 2.7955 and 267 at k = 1 differ by a factor of nearly three in the underlying covariance.

Since the two-dimensional confidences do not match the one-dimensional intuition, the reader cannot infer k from a percentage either. State the factor.

## Two: the dimension

A plan-view ellipse, a three-dimensional ellipsoid, and a single-axis sigma are three different objects with three different confidence conventions at the same k.

"Semi-major axis of the horizontal ellipse" is unambiguous. "Uncertainty" is not.

## Three: the error model and its revision

The model has revisions and there are competing models for gyroscopic and other tools. A number from one is not comparable with a number from another.

## Four: the parameter set

The same model with a basic MWD parameter set and with an in-field-referenced, multi-station-corrected set gives substantially different answers on the same well.

This is the one most often omitted and it is the one that moves the number most.

## Five: the station

Uncertainty grows down the well. A single number is the value at one depth, usually total depth, and the value at the depth that actually matters may be quite different.

## The other two worth adding

**The azimuth of the major axis**, because a long thin ellipse pointing at the neighbour and one pointing away are very different situations with the same semi-major axis.

**The semi-minor axis**, because the ratio is the shape, and the shape is what makes the direction matter.

## A defensible statement

"At 8000 m measured depth, ISCWSA MWD Rev4 with the standard parameter set and no multi-station correction, referenced to a global geomagnetic model: horizontal ellipse semi-major 267 m, semi-minor 29 m, major axis azimuth 165 degrees, at k = 2.7955, which is the two-dimensional 95 percent factor."

Long, and every clause changes the meaning.

## What people actually write

"Position uncertainty: 267 m."

Which is then compared against another report's "position uncertainty: 95 m", and the difference is attributed to the wells rather than to the fact that one is a 95 percent semi-major axis and the other is a one-sigma lateral.

## The misconception to avoid

"Everyone uses the same conventions, so the extra words are noise." The k, the model revision and the parameter set all vary between operators and service providers, and each of them moves the number by tens of percent or more. The extra words are the only thing that makes two numbers comparable.

## Exercise

Take the validation well's ellipse and write the full statement above from memory of its parts.

Then write the same well's uncertainty as a one-sigma lateral sigma, and state the ratio between that number and the 95 percent semi-major axis, to show how far apart two honest quotations of the same well can be.
