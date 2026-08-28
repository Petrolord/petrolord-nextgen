# Thickening the water

Every displacement number you have computed in this course so far was a hostage of one ratio. The Ekene water runs at 0.5 cp against oil at 1.8 cp, and with the endpoint permeabilities 0.3 and 0.9 that pair fixes the mobility ratio at 1.2 before a single barrel is injected. Rock properties are set by geology and viscosities by thermodynamics, so it is easy to conclude that the ratio is simply dealt to you.

Polymer flooding is the industry's refusal to accept that deal. Dissolving a long chain polymer in the injection water raises the water's viscosity, and only the water's. The oil is untouched, the rock is nominally untouched, and every consequence flows from one substitution: wherever the fractional flow machinery used $\mu_w$, it now uses a larger value.

## One multiplier, threaded through everything

The engine implements this with a single screening knob. A displacement spec may carry `polymerMuMult`, and `makeFwFunction` applies it at the door:

$$\mu_{w,\text{eff}} = \mu_w \times \text{polymerMuMult}$$

At the design multiplier of 4 the Ekene water becomes $0.5 \times 4 = 2$ cp of effective viscosity, and the engine reports exactly that through `analyzeDisplacement` as `muWeff` 2. Nothing else in the spec changes: the Corey set keeps Swc 0.35, Sor 0.25, krwMax 0.3, kroMax 0.9, nw 2.5, no 2.0, and the oil stays at 1.8 cp.

Now push the substitution through the endpoint mobility ratio:

$$M = \frac{k_{rw,max}/\mu_{w,\text{eff}}}{k_{ro,max}/\mu_o} = \frac{0.3/2}{0.9/1.8} = \frac{0.15}{0.5} = 0.3$$

The ratio falls from 1.2 to 0.3, a factor of exactly the multiplier, because $\mu_{w,\text{eff}}$ sits alone in the water mobility's denominator. A flood that was mildly unfavorable-to-neutral is now strongly favorable: at the endpoints, oil is more than three times as mobile as the thickened water chasing it. The chase car has been slowed below the car it is chasing.

## What the fw curve does with a slower water

Recall the shape logic from the fractional flow equation. Water's share of the flow at any saturation is set by the ratio $(k_{ro}\,\mu_w)/(k_{rw}\,\mu_o)$, and multiplying $\mu_w$ by 4 multiplies the whole ratio by 4 at every saturation simultaneously. Water finds it uniformly harder to claim its share, so the entire fw curve slides down and to the right: at any given saturation less water flows, and any given fractional flow is reached only at a higher saturation.

A curve pushed to the right meets its Welge tangent later. That is the geometric seed of everything the next lesson quantifies, and it is worth predicting before you measure: a lower M must raise the front saturation, raise the fractional flow at the front, and delay breakthrough in pore volume terms.

## At the panel

{{panel:sc-design-explorer}}

Switch the panel to its polymer mode and leave the multiplier at its default of 4. Read the tiles first: `muWeff` shows 2 and M shows 0.3, the two numbers this lesson derived by hand. Then look at the two fw curves drawn together, the base case and the polymer case. Slide the multiplier from 1 up to 6 and watch the polymer curve peel away from the base curve, always downward and rightward, while M in the tile falls in exact inverse proportion to the slider. At a multiplier of 1 the two curves are the same curve, which is the cleanest possible check that the knob does nothing but scale $\mu_w$.

## The misconception to avoid

The one to guard against here is treating the multiplier as a mystery input. It is not a tuning constant or an empirical fudge: it is a physical claim, namely that the injected water's viscosity is this many times fresh water's, and real polymer solutions reach a multiplier of 4 comfortably at ordinary field concentrations. The mystery, such as it is, lives in what the single multiplier leaves out, and lesson 3 is an inventory of exactly that. What you may not do is read precision into it: a screening multiplier of 4 does not distinguish 3.8 from 4.2, and no conclusion you draw from it should need that distinction.

## Exercise

First, repeat the endpoint algebra at a multiplier of 6: compute $\mu_{w,\text{eff}}$ and M by hand, and state the general rule connecting the multiplier to M in one sentence.

Second, a colleague argues that since polymer slows the water down, the polymer flood must also inject fewer barrels per day and therefore recover oil more slowly in calendar time. Using the panel and the distinction between the fw curve and the injection rate, explain which part of that claim the fractional flow machinery actually addresses, and which part belongs to facilities and injectivity questions this screening model does not touch.
