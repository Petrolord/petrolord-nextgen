# The story so far

This tier has one idea in it, and everything else has been a demonstration of that idea.

## What a single number hides

A curve hides its shape. A percentage hides its percentile. A base case hides where it sits in its own distribution.

Every module in this tier took one confident looking figure and asked what had been folded away inside it. The answers were never small.

## The four things you took apart

The cost time curve looked like a picture of a well. It is the operations chart, built by walking the schedule and accruing each line on its own basis: a per-day line rises with elapsed time, a lump lands as a step, a per-metre line moves only while the bit is turning. Read the shape and you can see which lines are running.

The endpoint looked like a rounding question. It is an identity. The curve finishes exactly at the AFE base cost, with an absolute error of zero across every combination tested, because contingency does not accrue along it. Every gap between a total and the curve is exactly the contingency, and that is a check you can run rather than a claim you have to accept.

The uncertainty looked like a list of ranges. It is a statement about which variables the answer is made of. Rate of penetration dominates, triangular is the working default, correlation changes the spread without touching a mean, and one canonical sampler does the drawing.

The risked result looked like numbers with more precision than the deterministic one. They mean nothing until you say which convention they are in and where the base case falls among them.

## Why the deterministic estimate is not the middle

Pull those together and you arrive at the result this tier is built on.

Time goes as one over rate, so cost is convex in rate of penetration. A symmetric range of rates gives an asymmetric range of costs, and the mean cost lands above the cost at the mean rate. On the linear fixture the analytic mean sits a fraction of 0.02 above the modal base, and on a case whose uncertainties are rates the effect is larger.

So a deterministic estimate built on most likely rates is not a most likely cost. It is optimistic, structurally, before anybody has been careless.

That is the sentence to carry out of this tier. Not that estimates are uncertain, which everybody says, but that the standard way of building one has a known direction of error you can now measure.

## Exercise

Write down, in one sentence each, what the curve hides, what a contingency percentage hides and what a base case hides.

Then name the single mathematical fact that produces the third of those, and state it without using the word convexity.
