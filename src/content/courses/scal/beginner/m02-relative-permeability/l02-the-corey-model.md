# The Corey model

The laboratory hands you relative permeability as a handful of measured points. The engine, and most of the industry, carries those points as a Corey model: two power laws on a normalized saturation axis. This lesson gives you the three-line model that generates every curve in this course.

## Normalized saturation first

The mobile window of the Ekene sand runs from $S_{wc} = 0.35$ to $1 - S_{or} = 0.75$. The Corey model begins by rescaling that window onto the unit interval:

$$S_{wn} = \frac{S_w - S_{wc}}{1 - S_{wc} - S_{or}}$$

$S_{wn}$ is 0 at connate water, 1 at residual oil, and the fraction of the mobile window that has been traversed everywhere in between. For Ekene the denominator is $1 - 0.35 - 0.25 = 0.4$, the movable fraction you computed in module 1.

Outside the window the engine clamps $S_{wn}$ to the interval $[0, 1]$: a saturation below connate reports $S_{wn} = 0$ and a saturation above $1 - S_{or}$ reports $S_{wn} = 1$. The curves are flat outside the mobile window because nothing moves there.

## The two power laws

$$k_{rw} = k_{rw,max} \, S_{wn}^{\,n_w} \qquad k_{ro} = k_{ro,max} \, (1 - S_{wn})^{\,n_o}$$

Four parameters beyond the endpoints: the endpoint values $k_{rw,max}$ and $k_{ro,max}$, and the exponents $n_w$ and $n_o$. The Ekene sand's committed set is

| parameter | value |
|---|---|
| $S_{wc}$ | 0.35 |
| $S_{or}$ | 0.25 |
| $k_{rw,max}$ | 0.3 |
| $k_{ro,max}$ | 0.9 |
| $n_w$ | 2.5 |
| $n_o$ | 2.0 |

Read the structure of the two laws. The water curve starts at zero and rises to its endpoint as $S_{wn}$ goes to 1. The oil curve starts at its endpoint and falls to zero. The exponents set the shape of the rise and fall: an exponent of 1 would be a straight line, and larger exponents bow the curve downward, holding it low for longer before it climbs. Real curves bow. Water at low saturation occupies the smallest, worst-connected pores, so its permeability grows slowly at first; the exponent encodes exactly that.

## What the exponents do

Hold everything else fixed and raise $n_w$. The water curve sags: at every interior saturation $k_{rw}$ drops, because $S_{wn} < 1$ and a larger power makes a small number smaller. The endpoints do not move at all, since $0^{n_w} = 0$ and $1^{n_w} = 1$ for any exponent. Exponents shape the interior of the curve and only the interior. Endpoint values scale the whole curve up and down. That division of labour, shape versus scale, is worth fixing in your head now, because module 3 will show the fractional flow curve inheriting both.

The Ekene water exponent of 2.5 against an oil exponent of 2.0 means the water curve bows harder than the oil curve. At the middle of the mobile window the water phase has reached only a small fraction of its endpoint while the oil phase has fallen to exactly a quarter of its own. The next lesson computes both numbers by hand.

{{panel:sc-displacement-explorer}}

In the panel, leave the oil viscosity at its Ekene value and move the water exponent $n_w$ between 1 and 4. Watch the left plot: the blue water curve sags as the exponent rises and recovers as it falls, while its two ends stay pinned. Confirm that the red oil curve does not move, and that the tiles above the plot keep the same mobility ratio M throughout, because M is built from the endpoints alone. Then set $n_w$ back to 2.5, the committed Ekene value.

## The model is a choice

Nothing in physics requires relative permeability to follow a power law. The Corey form is popular because it fits many water wet sandstone datasets well with two shape parameters, because it is guaranteed monotonic, and because it is trivial to evaluate everywhere. The engine's owner lock keeps the model deliberately thin: no three phase extension, no hysteresis, and none of the more elaborate parametric families. When laboratory data will not follow a power law, the answer is not a fancier model but a table, and lesson 5 shows how the engine consumes tables directly.

## The misconception to avoid

Do not read $n_w = 2.5$ as a physical constant of water or $n_o = 2.0$ as a constant of oil. The exponents belong to the rock and fluid pair together: the same water in a different pore network fits a different exponent. They are fitting parameters with physical flavour, not physical law. The committed Ekene values are the truth for this course because the fixture plants them, and a laboratory report is the truth for a real sand because the core was measured; neither number travels to another field on its own authority.

## Exercise

First, compute $S_{wn}$ at $S_w = 0.63$ for the Ekene endpoints, then state which is larger at that saturation, $k_{rw}$ or $k_{ro}$, using only the structure of the two power laws and the endpoint values 0.3 and 0.9. Check your reasoning against the panel.

Second, a colleague proposes simplifying the model by setting both exponents to 1. Describe in two sentences what the two curves become, and name one physical feature of two phase flow that the simplified model can no longer represent.
