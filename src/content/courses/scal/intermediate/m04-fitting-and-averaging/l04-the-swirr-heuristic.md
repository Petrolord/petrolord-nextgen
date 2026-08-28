# The Swirr heuristic

Lesson 1 planted a flag: the power law has three numbers in it and only two are fitted. The third, $S_{wirr}$, is supplied. This lesson is about what happens when nobody supplies it, because the engine then falls back on a heuristic, and the heuristic is a choice with consequences that show up in your fitted parameters.

## What the default does

When `fitJPowerLaw` or `averageJCurves` receives no irreducible saturation, each sample defaults to a value just below its own lowest measured $S_w$: the engine takes the data minimum and steps down by 0.02.

Read that rule again as a statement about evidence. The data minimum is where the LAB STOPPED MEASURING, which is not the same thing as where the ROCK STOPS DRAINING. A centrifuge or porous-plate experiment ends at some maximum pressure, and the lowest saturation reached at that pressure is an artefact of the apparatus. The heuristic quietly promotes that artefact into a physical parameter.

On the Ekene plugs the gap is visible by design. The lab tables run down to $S_w = 0.30$, so the default lands at 0.28. The design truth, the value the curves were actually generated with, is 0.25. The default misses it, not because the code is wrong but because the data alone cannot know what lies below their own floor.

## How the distortion propagates

$S_{wirr}$ sits inside the coordinate:

$$S_w^* = \frac{S_w - S_{wirr}}{1 - S_{wirr}}$$

Set it too high and every $S_w^*$ shrinks, and shrinks UNEVENLY: points near the bottom of the data are compressed toward zero far more than points near full saturation. With the true value 0.25, the lowest Ekene point at $S_w = 0.30$ maps to $S_w^* = 0.05/0.75$, one fifteenth. With the default 0.28 it maps to $0.02/0.72$, one thirty-sixth, less than half as far from the axis. The bottom of the curve has been dragged toward the asymptote while the top barely moved.

A power law fitted to that warped axis must bend to follow it, so the fitted $a$ and $b$ shift away from the truth, and the miss is not random noise but a systematic bowing: in log coordinates the warped points no longer sit on a straight line at all.

That last fact is also your instrument for detecting the problem.

## The tell is the fit quality

Run the same data twice. With the true $S_{wirr}$, the Ekene points are exactly straight in log space and the fit reports an $r^2$ of 1. With the default, the points bow and the log-space $r^2$ drops below it. The residual pattern is characteristic too: misses of one sign at both ends of the curve and the other sign in the middle, the signature of an axis warp rather than of measurement scatter.

So the workflow is the one the engine's own documentation points to. Fit with the default, look at the log-space $r^2$ and the residuals, and if they show the bow, treat that as evidence the true irreducible saturation sits BELOW your data floor. Then supply an override and refit. Independent evidence for the override is usually available: the connate water saturation from log analysis, the asymptote read from the plateau of a longer-running experiment on a sister plug, or, as with Figure 4-18, the published asymptote of the curve itself.

There is one more subtlety when several samples are averaged without an override. Each sample then gets its OWN default, keyed to its own data floor. Two plugs measured to different depths of desaturation end up normalized against different irreducible saturations, so they disagree about the $S_w^*$ axis itself before any averaging begins. A shared override removes that disagreement in one stroke, which is precisely why the averaging function accepts one.

## The misconception to avoid

The dangerous belief is that a default is neutral, that leaving a field blank means making no assumption. The opposite is true here. Leaving $S_{wirr}$ blank makes a specific, strong assumption: that the rock's irreducible saturation sits 0.02 below the driest point your lab happened to reach. Sometimes that is nearly right. It is still an assumption, and the only honest postures are to check it against the fit quality or to override it with evidence. Blank is not neutral; blank is a number you did not choose.

## Exercise

First, a plug is measured down to $S_w = 0.42$ and the analyst supplies no irreducible saturation. State the value the engine will use, then compute $S_w^*$ for the lowest data point under that default, as a fraction.

Second, log analysis on the same interval reports connate water at 0.30. Recompute $S_w^*$ for the lowest data point with 0.30 supplied, compare the two fractions, and say in one sentence which end of the fitted curve the change will move most and why.
