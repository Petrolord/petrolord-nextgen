# Working the capstone

Six numbers, one window, and the order to compute them in.

{{panel:wt-buildup-explorer}}

## What is asked

The capstone gives you the buildup: 40 shut-in pressures after 36 hours of production at 450 stb/d, a flowing pressure at shut-in of 4530.771773811249 psia, and the reservoir properties you have been using all tier.

It asks for six quantities from ONE analysis: the Horner permeability, the skin, the semilog slope, the extrapolated pressure p*, the skin pressure drop, and the radius of investigation at the producing time.

All six come from the same fit, over the same window: shut-in times at or after 5 hours. Thirteen points.

## Why that window is specified

Because the capstone is testing whether you can run the analysis, not whether you can guess a window. The window is given so that everybody's six numbers are comparable and so that the grading tolerance means something.

In practice you would justify the window yourself, and the Professional tier gives you the tool to do it. Here it is stated.

## The order

**One. The slope.** Fit a least-squares line to pws against log10((36 + dt)/dt) over the thirteen points with dt at or after 5 hours. Report the magnitude of the slope in psi per cycle.

**Two. The permeability.** k = 162.6 q B mu / (m h), with q = 450, B = 1.25, mu = 0.9, h = 45.

**Three. p star.** The intercept of the fitted line, which is its value where log10 of the Horner ratio is zero, that is at a Horner ratio of 1.

**Four. The skin.** Read the line's value at one hour of shut-in, which on the Horner axis is a ratio of 37, so p1hr = intercept + slope times log10(37). Then

    S = 1.1513 [ (p1hr - 4530.771773811249)/m - log10( k / (phi mu ct rw^2) ) + 3.2275 ]

using the k you just computed and phi 0.18, mu 0.9, ct 1.2e-5, rw 0.354.

**Five. The skin pressure drop.** 141.2 q B mu S / (k h), using the SAME k and S you just reported. Not the planted ones.

**Six. The radius of investigation.** ri = sqrt( k t / (948 phi mu ct) ) with t = 36 hours, the producing time, and again the k you reported.

## The trap in steps five and six

Both use k, and both are graded against values computed from the FITTED permeability rather than from the planted 85 mD.

If you substitute 85 into the skin pressure drop or the radius of investigation, you will get a number that is close but outside tolerance, and it will be close enough that the error is easy to miss. The chain has to stay internally consistent: every downstream quantity uses the upstream quantity you actually reported.

## The precision

Report full precision. The tolerances are tight because the grader is checking that the analysis was run rather than estimated: the permeability tolerance is 0.05 mD, which is far tighter than any real test result deserves and is exactly the point.

The panel will give you every one of the six directly. Using it is the intended route. Doing the arithmetic by hand first and then checking against the panel is the better route, because the arithmetic is what you are learning.

## What to notice while you work

The permeability will come out a few percent below 85 and the skin a few tenths below 6.5, both low, both from the same cause: there is still a trace of the storage transition in the last thirteen points.

p* will come out within a fraction of a psi of the initial 4800. That is the buildup working well, and it is the easiest case: an infinite-acting reservoir with very little produced.

The flow efficiency, which is not graded, will come out well below 1. That is the sentence you would put at the top of a report.

## Exercise

Work all six by hand from the definitions above before opening the panel, using the fitted slope and intercept the panel gives you as the only inputs you take from it.

Then compare. Any disagreement is an arithmetic error in your chain and it is worth finding, because the same chain runs through every well test you will ever analyse.
