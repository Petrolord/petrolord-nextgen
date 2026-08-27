# The story so far

This course began with a rock holding two fluids and ended with a schedule: how much oil a waterflood pushes out of the Ekene sand, and when. Before the capstone, walk the whole argument once more, end to end, because the capstone is nothing but this argument asked back in six numbers.

## The arc in five steps

**Endpoints first.** Connate water at $S_{wc} = 0.35$ will not move. Residual oil at $S_{or} = 0.25$ will not move either. Everything the flood can ever win lives in the window between them, a movable fraction of $1 - 0.35 - 0.25 = 0.4$ of the pore volume. On Ekene's 22410845.5314109 barrels of pore space that is 8964338.21256436 barrels of movable oil. No curve, no tangent, and no injection schedule changes that window. Only the endpoints do.

**Curves next.** Inside the window, the Corey model turned two exponents and two endpoint permeabilities into full curves: $k_{rw} = 0.3\,S_{wn}^{2.5}$ and $k_{ro} = 0.9\,(1 - S_{wn})^{2}$. You checked it by hand at $S_w = 0.55$, where $S_{wn}$ is exactly one half, and got $k_{rw} = 0.05303300858899109$ and $k_{ro} = 0.2249999999999999$.

**Then the race.** Fractional flow folded both curves and both viscosities into one function, $f_w(S_w)$, the fraction of the passing stream that is water. Its S-shape is the geometry every later answer came from. The endpoint mobility ratio $M = (0.3/0.5)/(0.9/1.8) = 1.2$ told you the race is nearly fair on Ekene before any curve was drawn.

**Welge made it a front.** The tangent from $(S_{wc}, 0)$ found the one saturation that travels as a shock. Behind the front the saturation averages higher than the front itself, and that distinction, front versus average, produced every breakthrough number in the course.

**Recovery and the clock.** After breakthrough, each outlet saturation carries its own pore volumes injected and its own recovery. Pore volumes became days through nothing more than the pore volume and an injection rate.

## The Ekene six

These are the six numbers the capstone grades, all derived in modules 3 through 5 and all visible in the displacement explorer you have been using since module 2.

| Quantity | Symbol | Value |
|---|---|---|
| Mobility ratio | $M$ | 1.2 |
| Front saturation | $S_{wf}$ | 0.6372 |
| Fractional flow at the front | $f_{wf}$ | 0.8682763300877854 |
| Pore volumes injected at breakthrough | $Q_{iBt}$ | 0.33077027444818546 |
| Displacement efficiency at breakthrough | $E_{DBt}$ | 0.5088773453049006 |
| Ultimate displacement efficiency | $E_{Dmax}$ | 0.6153846153846154 |

Read the table as a story, not a list. A nearly fair race ($M$ just above 1) builds a high front (0.6372 against a ceiling of 0.75), which arrives after only a third of a pore volume, having already displaced about half of what can ever be displaced. The remaining climb from 0.509 to 0.615 is the long, water-heavy tail that module 5 priced in pore volumes.

Two internal checks tie the table together, and you should be able to produce both from memory. First, $Q_{iBt} = 1/f_w'(S_{wf})$, the reciprocal of the tangent slope 3.023246274678918. Second, the average saturation behind the front at breakthrough is $S_{wc} + Q_{iBt} = 0.6807702744481854$, and pushing that through $E_D = (\bar{S}_w - S_{wc})/(1 - S_{wc})$ returns 0.5088773453049006 exactly.

## The misconception to avoid

The most damaging way to misread the table is to treat $E_{Dmax} = 0.6153846153846154$ as a forecast of field recovery. It is not. It is the ceiling on displacement efficiency in rock the water actually sweeps, under the one-dimensional assumptions the next lesson lists. Real fields lose more oil to rock the water never contacts than to rock it contacts and leaves at residual, and that sweep problem belongs to the Waterflood course, which imports everything you built here. When you quote 0.615 to anyone, say what it is the ceiling of.

A quieter cousin of the same error: quoting $E_{DBt}$ as "recovery at breakthrough" without the denominator. It is a fraction of the oil in the swept volume, referenced to $1 - S_{wc}$, and module 5 showed how much argument hides in that denominator.

## Exercise

First, reproduce the two internal checks without opening the panel: from $f_w' = 3.023246274678918$ recover $Q_{iBt}$, then from $Q_{iBt}$ recover the average saturation behind the front and $E_{DBt}$, carrying full precision through both steps.

Second, write one sentence per row of the Ekene six explaining what physical decision that number informs: which one prices the water handling plant, which one dates the first produced water, which one bounds the reserves booking, and which one warned you before any curve was drawn whether this flood would be easy or hard.
