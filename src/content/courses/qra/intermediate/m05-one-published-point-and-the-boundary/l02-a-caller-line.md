# A line the analyst supplies

{{panel:qr-societal}}

A single point judges a curve at one N. Many analysts want more: a line through the R2P2 point that judges the curve across a range. That line is common practice, and it is a legitimate criterion to use, but R2P2 does not print it and the engine does not carry it as a preset. This lesson shows how an analyst supplies it as their own, what the engine returns against it for the JISIKE off-site curve, and how the engine's basis keeps the authorship honest.

## The line most people draw

The line usually drawn through the R2P2 point has a slope of minus one on the log-log plane. In the engine's terms that is C = 0.01 and alpha = 1: at N = 50 it gives the point's frequency, and it rises tenfold for every tenfold fall in N. With no smallest N given, the engine starts such a line at N = 1 by default. The analyst gives it as a line, { constantC, exponentAlpha }, because the preset r2p2-para-136 is the point alone.

## The JISIKE curve against it

The comparison returns BELOW, with a worst ratio of 0.014910 at N = 3.000000. Every corner of the curve now falls inside the line's range, including the corner at N = 3 that the Dutch line left unchecked, and that corner carries the worst ratio.

| criterion | range checked | state | worst ratio |
| --- | --- | --- | --- |
| r2p2-para-136, the point | N = 50 only | BELOW | 0.001000 |
| the analyst's line, C = 0.01, alpha = 1 | from N = 1 | BELOW | 0.014910 |
| vrom-establishments, the Dutch line | from N = 10 | EXCEEDS | 18.000000 |

The analyst's line is risk neutral and generous to large events compared with the Dutch line, so the corner at N = 300 that dominates the Dutch comparison is far below it. Small, frequent events decide this comparison instead.

## Whose line it is

When a criterion is given as constants, the basis says its source is "criterion as given". That phrase is the engine's record that the line came from the caller. A report that uses this line must say the same thing in words: the line through the R2P2 point with slope minus one is the analyst's choice, adopted for a stated reason, and R2P2 prints one point. Presenting it as an HSE line would claim a publication that does not exist.

## Choosing a slope

A slope of minus one is only one choice. A risk averse line through the same point, alpha of 2, would sit lower at large N and higher at small N, and it could turn the comparison around. The engine accepts any positive alpha, refuses a line with no slope, and has no opinion about which to use. That judgement is the analyst's.

## What the engine will not do

The engine will not extend the R2P2 point on its own, will not choose a slope for it, and will not name a caller's line after R2P2. The engine keeps one published point, one published line, and whatever the analyst supplies, each labelled for what it is.

## Exercise

For the analyst's line with C = 0.01 and alpha = 1, compute the line's value at N = 3, then divide the JISIKE curve's F(3) of 0.000049700000 per year by it and confirm the worst ratio of 0.014910. Then say at which corner the ratio would be smallest, and why a risk neutral line gives that result.
