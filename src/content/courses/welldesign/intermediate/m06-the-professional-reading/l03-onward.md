# Onward

From one well's ellipse to two wells' separation.

## What the Expert tier adds

Everything in this tier described one well. The question an ellipse exists to answer involves two.

The Expert tier takes a reference well and an offset well, each with the covariance this tier computes, and produces a separation factor at every station of the reference: the distance between the wells, less the two hole radii and an allowance, divided by the combined uncertainty at the chosen confidence.

## What you will find there

**The published standard cases.** One reference well and eleven offsets, with published separation factors, all reproduced. Five of the eleven are below the industry no-go threshold of 1.

**A negative separation factor.** On the one case with a kickoff, the factor goes below zero, meaning the uncertainty envelopes overlap. And there the scale breaks: raising the confidence factor from 2 to 5 moves the number from about minus 1.06 to about minus 0.42, an exact two-fifths ratio, so choosing a wider confidence interval improves the number without moving either well.

**The geometry.** Closest approach between two minimum-curvature arcs has a closed form, and centre-to-centre distance is not clearance.

**The frame.** True, grid and magnetic north, the world magnetic model checked against its publisher's own test values, and what a declination error alone does to a position.

**Shared uncertainty.** Two wells from the same slot share their surface position and everything above the kickoff, and the calculation has to remove the common part rather than adding both covariances. That is what the kickoff depth in the standard case is for.

## Before you go

Two habits from this tier.

**Rotate before you interpret.** The map-frame covariance is the wrong six numbers to look at. Along-hole, highside and lateral answer three different questions and they differ by a factor of four.

**Attach a depth to every budget.** The leading source at total depth does not appear in the top five while the well is vertical. A pie chart without a station is a pie chart of nothing.

## The one sentence

A position uncertainty is three numbers in the well's own frame, dominated by a handful of sources that change with attitude, from a model that excludes exactly the errors most likely to hurt you.

## Exercise

Take the validation well's ellipse at total depth and imagine a second well parallel to it, 60 m away laterally, with the same uncertainty.

Argue qualitatively whether those two wells are safely separated, and list the three additional pieces of information you would need before answering properly.
