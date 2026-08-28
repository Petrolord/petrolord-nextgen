# Standing's correlation

The oldest of the three the engine carries, published in 1947, and still the default.

{{panel:fluid-correlation-explorer}}

## What it relates

Five quantities: bubble point pressure, solution gas ratio, oil gravity, gas gravity and temperature. Given any four, it returns the fifth.

In the form that returns pressure:

$$P_b = 18.2 \left[ \left(\frac{R_s}{\gamma_g}\right)^{0.83} 10^{(0.00091 T - 0.0125\,\text{API})} - 1.4 \right]$$

with pressure in psia, Rs in scf/stb and temperature in degrees Fahrenheit.

## What it was fitted to

Californian oils. Standing had 105 experimentally determined bubble points from 22 different crude-oil and natural-gas mixtures, all from California.

That is the sentence to remember about every correlation in this course. It is not a law; it is a curve through somebody's samples, and its accuracy on your oil depends on how much your oil resembles theirs.

## Reading the form

The structure is worth looking at rather than treating as a black box.

**Rs over gas gravity, to the 0.83.** More dissolved gas raises the bubble point, and the power is less than one, so the effect saturates. Heavier gas lowers it at fixed Rs.

**The exponent on ten.** Temperature raises the bubble point and API lowers it. Both enter through a single exponential, which is a strong statement about the shape of the dependence and is where most of the correlation's character lives.

**The 1.4 and the 18.2.** Fitting constants with no physical meaning. They are the two numbers that put the curve through the Californian data.

## Ekene through it

At 32 API, 0.75 gas gravity, 180 F and the designed 400 scf/stb, Standing returns a bubble point of

$$1912.1923059028293 \text{ psia}$$

The field is defined to bubble at 2000. So the correlation says that an oil of this description carrying 400 scf/stb would bubble about 88 psia below where Ekene is defined to bubble, a difference of about four and a half percent.

Run the same correlation the other way, fixing the bubble point at 2000 psia and asking for the solution gas, and it returns 421.94 scf/stb against the designed 400. The simulation course reported that number and this is where it comes from.

Both statements are the same disagreement seen from two directions. The designed fluid and Standing's Californian oils are not quite the same fluid, which is neither surprising nor a problem, as long as somebody says so.

## Why it is still the default

Because it is simple, it is well behaved over a wide range, and decades of use have established where it can be trusted. A correlation with a long track record and known limits is often more useful than a newer one whose failures nobody has catalogued yet.

The engine defaults to Standing for Pb, Rs and Bo, and the material balance and simulation courses both ran on that default.

## The precision trap

The engine returns 1912.1923059028293. That is sixteen significant figures on a correlation fitted to 105 measurements from one American state.

The digits are real in the sense that the arithmetic is deterministic and reproducible. They are not real in the sense of telling you where the bubble point is. Quote this number as 1912 psia to somebody who has to act on it, and carry the full precision only where you are checking that two calculations agree.

## The misconception to avoid

"Standing is the accurate one because everyone uses it." It is the most used one, which is a fact about the industry rather than about the oils. On a fluid outside its range another correlation may do better, and the only way to know is to have a measurement to check against, which is exactly what the Professional tier does.

## Exercise

First, use the panel to compute Standing's bubble point for Ekene, and state the difference from the designed 2000 psia both in psia and as a percentage.

Second, raise the solution gas from 400 to 600 scf/stb and record the new bubble point. Then explain, from the form of the correlation, why the increase in pressure is less than proportional.
