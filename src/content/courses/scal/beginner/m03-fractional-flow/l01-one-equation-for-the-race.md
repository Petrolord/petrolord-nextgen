# One equation for the race

Module 2 gave each fluid its own permeability curve. Water gets $k_{rw}(S_w)$, oil gets $k_{ro}(S_w)$, and both are functions of one bookkeeping variable, the water saturation. What module 2 did not answer is the question a flood engineer actually asks: when both fluids are moving through the same rock at the same time, what fraction of the flowing stream is water?

That fraction is the fractional flow of water, written $f_w$, and it is the single most important derived quantity in this course. Everything in modules 4 and 5, the front, the breakthrough time, the recovery curve, is read off this one function.

## Two Darcy laws, one pressure gradient

Picture a thin slab of the Ekene sand with water and oil flowing through it side by side, horizontally. Each phase obeys its own Darcy law, with its own relative permeability and its own viscosity, but the two phases share the same rock and, in the horizontal case with capillary pressure neglected, the same pressure gradient. Write the two rates, divide the water rate by the total, and the pressure gradient and the absolute permeability cancel. What survives is

$$f_w = \frac{1}{1 + \dfrac{k_{ro} \, \mu_w}{k_{rw} \, \mu_o}}$$

Read the structure before you plug in any numbers. The equation is a race between two mobilities. Water flows in proportion to $k_{rw}/\mu_w$, oil in proportion to $k_{ro}/\mu_o$, and $f_w$ is simply water's share of the combined flow. Nothing else enters: not the rate, not the absolute permeability, not the pressure drop. In the horizontal case the whole competition is decided by the two relative permeabilities at the local saturation and the ratio of the two viscosities.

The engine computes exactly this equation, with two guards worth knowing. Where $k_{rw}$ is zero or below, it returns $f_w = 0$ outright, and where $k_{ro}$ reaches zero it returns $f_w = 1$. Those guards are not numerical conveniences. They are the physics of the endpoints: at connate water the water phase cannot move, so none of the stream is water, and at residual oil the oil phase cannot move, so all of it is.

## Work one point

Take the Ekene curves at $S_w = 0.55$, the midpoint of the mobile range you computed in module 2: $k_{rw} = 0.05303300858899109$ and $k_{ro} = 0.2249999999999999$, with $\mu_w = 0.5$ cp and $\mu_o = 1.8$ cp. The competing product in the denominator is

$$\frac{k_{ro} \, \mu_w}{k_{rw} \, \mu_o} = \frac{0.2249999999999999 \times 0.5}{0.05303300858899109 \times 1.8} = 1.1785113019775781$$

so

$$f_w = \frac{1}{1 + 1.1785113019775781} = 0.459029062228061$$

At the middle of its mobile range, the Ekene stream is a little less than half water. Notice how the two curves pull in opposite directions: oil still has four times water's relative permeability at this saturation, but water's viscosity advantage, 0.5 cp against 1.8 cp, claws most of that back.

## See it in the panel

{{panel:sc-displacement-explorer}}

Leave every input at its Ekene default. The right hand plot is $f_w$ against $S_w$ across the mobile range. Find $S_w = 0.55$ on the axis and confirm the curve passes just below one half there. Then look at the two ends of the curve: it sits flat on zero at $S_w = 0.35$ and flat on one at $S_w = 0.75$. Those flats are the engine guards you just read about, and no choice of viscosities in the panel will move them.

## What the equation leaves out

This is the horizontal form, and it is the only form this tier uses. The engine also carries a dip term, an extra piece in the numerator that lets gravity help or hinder the water depending on whether the flood runs updip or downdip. That term belongs to the Expert tier, where it is worked in full. What you must carry from here is only this: when the dip term is zero, viscosities enter the competition purely as the ratio $\mu_w / \mu_o$, and the rate you inject at does not change $f_w$ at a given saturation at all.

## The misconception to avoid

The most common early mistake is to read $f_w$ as the water cut you would measure at a well today. It is not, or not directly. The fractional flow curve is a property of the rock and fluid system: one value of $f_w$ for each saturation, fixed before the flood even starts. A producing well moves along that curve as the saturation at the outlet changes through time. Module 4 makes the connection precise. Until then, hold the distinction firmly: $f_w(S_w)$ is a curve you compute once, the produced water cut is a trajectory along it.

## Exercise

First, compute $f_w$ at $S_w = 0.6$, where the Ekene curves give $k_{rw} = 0.09264485332524548$ and $k_{ro} = 0.1265625$. Carry all the figures your calculator holds and check yourself against the panel.

Second, answer in words: the operator doubles the injection rate on a horizontal element of the flood. What happens to the value of $f_w$ at $S_w = 0.6$, and which assumption in the derivation is doing the work in your answer?