# Mobility ratio

Lesson 1 framed fractional flow as a race between two mobilities. This lesson gives the race a single score. The mobility ratio $M$ compresses a whole flood's character, favorable or unfavorable, into one number, and it is the first thing a reservoir engineer quotes about any waterflood.

## Mobility, then the ratio

A phase's mobility is how easily it moves: relative permeability over viscosity, $k_r / \mu$. But a curve divided by a constant is still a curve, so which saturation do you quote? The convention is to take each fluid at its own best. Water is at its most mobile where the rock is as wet as a flood can make it, $S_w = 1 - S_{or}$, where $k_{rw}$ reaches its endpoint $k_{rw,max}$. Oil is at its most mobile at connate water, $S_w = S_{wc}$, where $k_{ro}$ reaches $k_{ro,max}$. The endpoint mobility ratio is the displacing fluid's best over the displaced fluid's best:

$$M = \frac{k_{rw,max} / \mu_w}{k_{ro,max} / \mu_o}$$

For the Ekene sand: $k_{rw,max} = 0.3$, $\mu_w = 0.5$ cp, $k_{ro,max} = 0.9$, $\mu_o = 1.8$ cp, so

$$M = \frac{0.3 / 0.5}{0.9 / 1.8} = \frac{0.6}{0.5} = 1.2$$

Water at its best is only twenty percent more mobile than the oil it is chasing. That is a favorable flood in everything but the strictest sense: when $M$ is at or below about one, the displacing water has no mobility advantage to exploit, and the displacement stays orderly. Large $M$ means the water can outrun the oil, and the fractional flow curve will show it.

## A textbook contrast

The engine ships a classic classroom case for exactly this comparison: $S_{wc} = 0.2$, $S_{or} = 0.2$, $k_{rw,max} = 0.4$, $k_{ro,max} = 1.0$, both Corey exponents equal to 2, with $\mu_w = 0.5$ cp and $\mu_o = 5$ cp. Here

$$M = \frac{0.4 / 0.5}{1.0 / 5} = \frac{0.8}{0.2} = 4$$

an unfavorable flood, and every number in it is reachable by hand. At $S_w = 0.5$, the normalized saturation is $(0.5 - 0.2)/0.6 = 0.5$, so $k_{rw} = 0.4 \times 0.5^2 = 0.1$ and $k_{ro} = 1.0 \times 0.5^2 = 0.25$, and

$$f_w = \frac{1}{1 + \dfrac{0.25 \times 0.5}{0.1 \times 5}} = \frac{1}{1.25} = 0.8$$

Compare the two systems at their mobile midpoints. The Ekene sand at $S_w = 0.55$ carries $f_w = 0.459029062228061$, a little under half water. The textbook rock at $S_w = 0.5$ is already eighty percent water. Same equation, same kind of rock curves; the difference is almost entirely the oil viscosity, 1.8 cp against 5 cp.

## See it in the panel

{{panel:sc-displacement-explorer}}

Switch the panel to the textbook preset and read the mobility ratio tile: 4. Watch the $f_w$ curve at the same time; it stands up early and steep. Then switch back to the Ekene defaults, confirm the tile reads 1.2, and see the curve lie back down. You are watching one number summarize the shape of a whole function.

## What M does and does not decide

$M$ is built from endpoints only. It does not know the Corey exponents, so two rocks with the same endpoints and different curve shapes share one $M$ and still flood differently in the middle of the range. It also says nothing about how much oil is recoverable, which the endpoints $S_{wc}$ and $S_{or}$ decide on their own, as module 5 will make exact. Treat $M$ as the headline, not the story: it tells you the character of the competition, and the full fractional flow curve tells you the outcome.

## The misconception to avoid

Do not compute $M$ by taking $k_{rw}$ and $k_{ro}$ at the same saturation. It is tempting, because lesson 1 did exactly that inside $f_w$, but $M$ is defined from two different saturations on purpose: each fluid is scored where it is strongest, water at $1 - S_{or}$, oil at $S_{wc}$. A ratio taken at a single shared $S_w$ is a local mobility ratio, a different and rate-of-change flavored object. When a colleague quotes $M$, the endpoint convention is what they mean.

## Exercise

First, recompute the Ekene mobility ratio with the water endpoint doubled to $k_{rw,max} = 0.6$, everything else unchanged. Write down the new $M$ and say in one sentence whether the flood became more or less favorable.

Second, show algebraically that for fixed rock endpoints and fixed $\mu_w$, the Ekene $M$ grows in direct proportion to $\mu_o$, and use that to state what oil viscosity would push the Ekene sand to the textbook value $M = 4$.