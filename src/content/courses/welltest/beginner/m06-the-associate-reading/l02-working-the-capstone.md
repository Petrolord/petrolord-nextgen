# Working the capstone

Six numbers, one window, and the order to compute them in.

{{panel:wt-buildup-explorer}}

## What is asked

The capstone is set on a test of its own: the OBODO-4 buildup, 40 shut-in pressures after 48 hours of production at 620 stb/d, with its flowing pressure at shut-in and its reservoir properties stated in the brief. Download the buildup file from the capstone card, open it in the buildup explorer's **Your test** mode, and type the brief's constants. No panel opens on it and no lesson prints its answers.

It asks for six quantities from ONE analysis: the Horner permeability, the skin, the semilog slope, the extrapolated pressure p*, the skin pressure drop, and the radius of investigation at the producing time. All six come from the same fit over one window the brief states.

This lesson walks the order on the teaching buildup you have used all tier (36 hours at 450 stb/d, the window at or after 5 hours, thirteen points), as a worked example. Your capstone numbers come from OBODO-4, so they will be different.

## Why that window is specified

Because the capstone is testing whether you can run the analysis, not whether you can guess a window. The window is given in the brief so that everybody's six numbers are comparable and so that the grading tolerance means something.

In practice you would justify the window yourself, and the Professional tier gives you the tool to do it. Here it is stated.

## The order, on the worked example

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

The panel's Your test mode will give you every one of the six directly once you have opened the file and typed the constants. Using it is the intended route. Doing the arithmetic by hand first and then checking against the panel is the better route, because the arithmetic is what you are learning.

## What to notice while you work

On the worked example the permeability comes out a few percent below the planted 85 and the skin a few tenths below 6.5, both low, both from the same cause: there is still a trace of the storage transition in the last thirteen points. Expect the same kind of shortfall on any buildup whose storage transition has not quite ended inside the window.

On the worked example p* comes out within a fraction of a psi of the initial 4800. That is the buildup working well, and it is the easiest case: an infinite-acting reservoir with very little produced.

The flow efficiency, which is not graded, will come out well below 1. That is the sentence you would put at the top of a report.

## Exercise

Work all six by hand from the definitions above before opening the panel, using the fitted slope and intercept the panel gives you as the only inputs you take from it.

Then compare. Any disagreement is an arithmetic error in your chain and it is worth finding, because the same chain runs through every well test you will ever analyse.
