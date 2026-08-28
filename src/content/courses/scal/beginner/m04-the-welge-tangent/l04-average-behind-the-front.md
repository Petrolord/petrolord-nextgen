# The average behind the front

Breakthrough tells you when water arrives. To know how much oil has left the reservoir by then, you need one more quantity: the average water saturation in the swept region behind the front, written $\bar{S}_{wBt}$. Welge's second gift is that the same tangent line that found the front also hands you this average, with no integration and no extra work.

## Extend the ruler

Take the tangent line you drew from $(S_{wc}, 0)$ through the touch point and keep extending it upward until it crosses the horizontal line $f_w = 1$. Read the saturation at that crossing. That saturation is the average behind the front at breakthrough. On the Ekene sand:

$$\bar{S}_{wBt} = S_{wc} + Q_{iBt} = 0.35 + 0.33077027444818546 = 0.6807702744481854$$

The identity is exact, not approximate. The tangent has slope $f'_{wF}$, it passes through $(S_{wc}, 0)$, and a line of that slope reaches $f_w = 1$ after a horizontal run of $1/f'_{wF}$, which is precisely $Q_{iBt}$. Geometry and material balance are saying the same sentence: by breakthrough, everything injected is water stored behind the front, so the average saturation there has risen above connate by exactly the pore volumes injected.

## Why the average exceeds the front value

The average 0.6807702744481854 sits above the front saturation 0.6372, and it must. The swept region is not uniform. At the leading edge it holds exactly the front saturation, while all the way back at the injector it approaches $1 - S_{or} = 0.75$, with the ramp of intermediate values in between. Averaging a profile that runs from 0.6372 up toward 0.75 has to land between those limits. If someone reports an average behind the front that is below the front saturation, their profile would have to dip below its own leading edge, which the displacement cannot do.

The gap is informative. The average exceeds the front by 0.6807702744481854 minus 0.6372, about 0.0436 saturation units, against a ramp that spans about 0.1128. The swept zone is weighted toward the front end of that range: most of it is recently swept rock still near the front saturation.

## From average saturation to oil recovered

Displacement efficiency asks: of the oil that was in the swept rock at the start, what fraction has been pushed out? Oil saturation started at $1 - S_{wc}$ and now averages $1 - \bar{S}_{wBt}$, so

$$E_{DBt} = \frac{\bar{S}_{wBt} - S_{wc}}{1 - S_{wc}} = \frac{0.6807702744481854 - 0.35}{0.65} = 0.5088773453049006$$

Just under 51 percent of the oil in place in the swept interval is already out by the day water first reaches the producer, before a single barrel of water has been produced. That is the payoff of a favorable mobility ratio: the flood does the majority of its displacement work while still dry. The remaining oil comes out in the long wet tail after breakthrough, and how that tail behaves, and where its ceiling lies, is the next module's story.

## See it in the panel

{{panel:sc-displacement-explorer}}

With the Ekene defaults, find the tiles for SwAvgBt and EDbt and verify both values above. Look at the plot: the tangent line is drawn through to $f_w = 1$, and the saturation under that intersection is the average, sitting visibly to the right of the touch point. Now raise oil viscosity to 10 cp. Watch the front saturation and the average both fall, and the gap between them widen: an unfavorable flood arrives earlier, with a leaner front and less of its work done. Return the slider and confirm the Ekene values come back.

## The misconception to avoid

The classic error in this module is using the front saturation where the average belongs, computing displacement efficiency as $(0.6372 - 0.35)/0.65$. That gives 0.4418, understating the true 0.5088773453049006 by about 6.7 percentage points of recovery, and it is wrong in principle: recovery is a statement about the whole swept volume, not about conditions at the shock face. The front saturation lives at one moving surface. The average carries the material balance. They differ by construction, and only one of them belongs in a recovery calculation.

## Exercise

First, verify the tangent identity numerically: multiply the tangent slope 3.023246274678918 by the horizontal run from $S_{wc} = 0.35$ to the average 0.6807702744481854, and confirm the product is 1 to the precision you can carry. State why it must be 1.

Second, without the panel, predict qualitatively what happens to the gap between $S_{wf}$ and $\bar{S}_{wBt}$ as a displacement becomes more favorable, for instance with a lighter, less viscous oil. One or two sentences, reasoning from the shape of the fractional flow curve near residual oil.
