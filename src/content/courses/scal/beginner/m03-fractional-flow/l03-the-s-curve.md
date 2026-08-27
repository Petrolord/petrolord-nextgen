# The S-curve

Two lessons in, you can compute $f_w$ at any single saturation. This lesson is about the shape of the whole function, because the shape is what module 4 will build the entire displacement theory on. Plotted from connate water to residual oil, the fractional flow of nearly every water-oil system traces the same silhouette: flat near the bottom, a steep climb through the middle, and a long flattening approach to one. An S, leaning on its back foot.

## The Ekene ladder

Here is the Ekene curve read at a ladder of saturations, every value straight from the engine:

| $S_w$ | $f_w$ |
| --- | --- |
| 0.45 | 0.06250000000000003 |
| 0.50 | 0.20920166128387394 |
| 0.55 | 0.459029062228061 |
| 0.60 | 0.7249143467053674 |
| 0.6372 | 0.8682763300877854 |
| 0.65 | 0.9034103334774292 |
| 0.70 | 0.9821436108054278 |

Read down the column and watch the climb. From 0.45 to 0.50 the curve gains about 0.15. From 0.55 to 0.60 it gains about 0.27, the biggest jump of any step on the ladder. From 0.65 to 0.70 the gain has collapsed to about 0.08. Ten saturation points either side of the middle, the curve is sprinting; near either end, it is crawling.

## Why the S

Both ends are pinned by the endpoint physics from lesson 1: $f_w$ is exactly zero at and below $S_{wc} = 0.35$, exactly one at and above $1 - S_{or} = 0.75$. The interesting question is why the middle is steep rather than a straight ramp between the pins.

The answer is that the two Corey curves are both power laws, moving in opposite directions. Just above connate water, $k_{rw}$ is minuscule, going as the 2.5 power of a small number, while $k_{ro}$ is still large, so the denominator of $f_w$ is huge and the curve hugs zero. But every step upward in saturation multiplies water's permeability quickly while cutting oil's, so the competing ratio $k_{ro}\mu_w / k_{rw}\mu_o$ does not fall gently, it collapses across a narrow band of saturation. The curve must carry almost the whole journey from zero to one across that band. At the top the roles reverse: $k_{ro}$ going as the square of a small number pins the curve to one long before the last drop of mobile oil is displaced.

A useful way to hold this: the S-shape is what happens when you divide one steeply rising power law by the sum of itself and one steeply falling power law. The exponents set how tight the S is, the viscosity ratio sets where it stands, and the endpoints set the floor and ceiling.

## See it in the panel

{{panel:sc-displacement-explorer}}

With the Ekene defaults set, run your eye along the $f_w$ curve and match it against the ladder table above at 0.45, 0.55, and 0.65. Then drag the water exponent $n_w$ slider up and down and watch what the middle of the S does while the two flat ends refuse to move. The exponents shape the climb; only the endpoints can move the pins.

## Where the curve is steep matters

Hold on to the location of the steep band, roughly $S_w$ 0.50 to 0.62 on the Ekene curve. In module 4 you will draw one straight line against this curve, and the geometry of that construction lands precisely because the curve has a steep middle: a front forms, at a definite saturation, and travels. If the curve were a straight diagonal from pin to pin, the flood would have no front at all, just an endless smear. The S-shape is not a curiosity of the plot. It is the reason waterfloods have a before and an after.

## The misconception to avoid

Do not read the curve as a schedule, with the field starting at the bottom left and the plot showing its progress through time. The fractional flow curve carries no time axis at all. It is a static property of rock and fluids, computed before any water is injected. Time enters only when the displacement theory of module 4 says which saturations exist where, and when. Two floods run at different rates move along the identical curve; a curve is not a history.

## Exercise

First, using the ladder table, compute the gain in $f_w$ across each 0.05 step from 0.45 to 0.70 and state which step is the steepest. (Treat the 0.6372 row as a bonus point inside its step, not a step of its own.)

Second, in two sentences: a colleague proposes summarizing the Ekene curve by its value at the midpoint of the mobile range, $f_w(0.55) = 0.459029062228061$, and interpolating straight lines to the two pins. What feature of the true curve would that summary destroy, and which module 4 quantity do you expect it to corrupt?