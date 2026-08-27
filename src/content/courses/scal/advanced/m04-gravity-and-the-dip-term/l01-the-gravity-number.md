# The gravity number

Every fractional flow curve you built at the Associate tier assumed a horizontal reservoir. The Ekene sand is not horizontal, and neither is any real one. When water displaces oil up a dipping bed, the density difference between the two fluids either fights the water or helps it, and the engine carries that fight in a single dimensionless coefficient. This lesson builds that coefficient term by term, on a fully specified design case, so that nothing in the next four lessons is a mystery.

## Where the term enters

The horizontal fractional flow equation divides one mobility by a sum of mobilities and nothing else. With dip, the numerator gains a correction:

$$f_w = \frac{1 - G \, k_{ro}}{1 + \dfrac{k_{ro} \, \mu_w}{k_{rw} \, \mu_o}}$$

The denominator is untouched. All of the new physics lives in $G$, the gravity coefficient, multiplied by the oil relative permeability at the saturation being evaluated. In field units the engine computes

$$G = \frac{0.001127 \times 0.433 \; k \, A \, (\gamma_w - \gamma_o) \sin\alpha}{\mu_o \, q_t}$$

where $k$ is in millidarcies, $A$ is the cross-sectional area in square feet, the specific gravities are dimensionless, $\alpha$ is the dip angle with displacement updip positive, $\mu_o$ is in centipoise and $q_t$ is the total rate in reservoir barrels per day. The constant pair multiplies out to 0.00048799099999999996: 0.001127 is the field-unit Darcy constant and 0.433 psi per foot converts a specific gravity into a pressure gradient.

Read the structure before the numbers. Permeability and area sit in the numerator because gravity segregation is a flow process: the denser water can only slump downdip as fast as the rock lets it. Rate sits in the denominator because the viscous pressure gradient you impose scales with rate, and gravity does not. A flood pushed hard is a flood in which gravity never gets a word in. That one placement, $q_t$ downstairs, is the entire subject of lesson 3.

## The designed case

The module works one case throughout, and the capstone grades it, so fix it now: the Ekene sand kr set (Swc 0.35, Sor 0.25, krwMax 0.3, kroMax 0.9, nw 2.5, no 2.0) with muW 0.5 cp and muO 1.8 cp, permeability k 250 md (the sand's design constant from the capillary work), cross-section A 20000 ft2, total rate qt 2000 rb/d, dip 10 degrees with displacement updip, gammaW 1.03, and gammaO 0.8654434250764526, which is not a free choice but follows from the locked API 32 gravity through 141.5/(131.5 + 32).

Walk the chain by hand. The density contrast is 1.03 minus 0.8654434250764526, which is 0.16455657492354747. The sine of 10 degrees is 0.17364817766693033. The numerator assembles as

$$0.00048799099999999996 \times 250 \times 20000 \times 0.16455657492354747 \times 0.17364817766693033 = 69.72159056222799$$

and dividing by $\mu_o q_t = 1.8 \times 2000 = 3600$ gives

$$G = 0.019367108489507776$$

That is the gravity number for the designed case, and the engine returns exactly this value. Hold on to its size: about 0.02. Since $k_{ro}$ never exceeds 0.9, the correction $G \, k_{ro}$ never exceeds about 0.017, so the numerator of $f_w$ is reduced by at most 1.7 percent, and by much less near the front where $k_{ro}$ is small. Gravity is present, and it is small. That honest reading is the theme of lesson 2.

{{panel:sc-design-explorer}}

Switch the panel to dip mode and leave the defaults, which are the designed case. Confirm the gravity coefficient tile reads 0.019367108489507776. Then move the dip slider to zero and watch the coefficient go to zero and every downstream tile collapse onto the flat-case values you know from the Associate tier. Move it back to 10 before the next lesson.

## Two saturations, one correction

The correction is proportional to $k_{ro}$, so it is largest where oil flows best, at low water saturation. At Sw 0.45, where $k_{ro}$ is 0.50625, the product $G k_{ro}$ is 0.009804598672813311 and $f_w$ drops from the flat 0.06250000000000003 to 0.061887212582949186. At Sw 0.55 the flat 0.459029062228061 becomes 0.4570287974572592. By the front region the oil curve has decayed so far that the correction is almost gone. Gravity reshapes the low-saturation toe of the curve, which is exactly the region that sets the Welge tangent, and that is why a one or two percent correction to $f_w$ can still move the front.

## The trap: sign conventions decide the physics

The formula contains $\sin\alpha$ with displacement updip positive. Inject downdip and produce updip, and water is climbing against its own weight, so gravity holds it back and the correction subtracts from $f_w$: that is $G$ positive, the favorable case. Reverse the geometry and $\alpha$ changes sign, $G$ goes negative, the numerator grows beyond one, and water fractional flow is enhanced. An engineer who copies a gravity number without checking which direction the displacement runs has a fifty percent chance of applying help where the field experiences harm. Lesson 4 prices that mistake exactly. The convention is not decoration; it is the physics.

## Exercise

First, recompute $G$ for the designed case with every input unchanged except the dip, at 5 degrees instead of 10. Use sin(5 deg) = 0.08715574274765817 and confirm you get a coefficient close to half the designed value, then say in one sentence why the ratio is not exactly one half but very nearly so at small angles.

Second, without computing anything, state which of the six inputs of the designed case you would change to double $G$ while leaving the fluid system untouched, and give two distinct ways to do it.
