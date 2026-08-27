# One curve under many

Module 1 left you with a problem. Three plugs came back from three laboratories, each with a perfectly good drainage curve, and the three curves do not look remotely alike. One tops out near 30 psi, one near 180 psi, and the third near 30 psi again despite coming from the tightest rock of the three. If capillary pressure is a property of the reservoir, which curve is the reservoir's?

Leverett's 1941 answer is that none of them is, and all of them are. Each lab curve is one rock and one fluid pair wearing the same underlying curve in different clothes. Strip away the clothes and a single dimensionless function of saturation remains. That claim, published in "Capillary Behavior in Porous Solids," Transactions of the AIME volume 142, is the working heart of this module, and this course tests it exactly rather than taking it on authority.

## Why there should be one curve at all

Capillary pressure at a given saturation is set by the curvature of the fluid interfaces sitting in the pore space. Two things control that curvature.

The fluid pair controls how strongly the interface resists bending: that is the interfacial tension $\sigma$, moderated by the contact angle $\theta$ the interface makes with the rock. Double $\sigma \cos\theta$ and every pressure on the curve doubles. This is a pure multiplier, and it carries no saturation dependence.

The rock controls the size of the pores the interface must squeeze through. Smaller pores mean tighter curvature and higher pressure at the same saturation. A natural measure of pore size is $\sqrt{k/\phi}$: permeability has units of area, so $\sqrt{k}$ is a length, and dividing by porosity first corrects for how much of the rock is actually open. Halve the characteristic pore size and every pressure doubles, again with no saturation dependence.

If both controls are pure multipliers, then dividing them out should leave a function of saturation alone:

$$J(S_w) \propto \frac{P_c}{\sigma \cos\theta} \sqrt{\frac{k}{\phi}}$$

That is the whole argument. The pressure scale belongs to the rock and fluids; the shape belongs to the pore geometry's statistics, which similar rocks share. Rocks from the same depositional system, with pore networks that are scaled copies of one another, should collapse onto a single $J$ curve. Rocks with genuinely different pore architecture should not, and the collapse failing is itself information.

## What "should collapse" means in this course

The word "should" is doing careful work. The collapse is exact only when the pore networks really are scaled copies, which for real core is an approximation. But this course's teaching fixture was built the other way around: the Ekene plugs' lab tables were generated from one designed $J$ curve through the engine's own scaling function, so on this data the collapse is exact to machine precision, and every step of the machinery can be checked against a known answer. You will watch real scatter appear later, in the published Leverett figure, where the collapse is honest but not perfect.

## Where the golden numbers come from

A word on provenance, because this course grades against published values and you deserve to know where they were read.

The original 1941 paper is behind the OnePetro paywall, and the AIME digital library scan is member gated. The engine's locked reference values are therefore typed from the faithful reproduction in Ahmed's Reservoir Engineering Handbook, 4th edition: Figure 4-18, which reprints the 1941 correlation for unconsolidated sands, and Example 4-7, a fully printed J-function worked example that module 3 walks end to end. The test suite records this sourcing in its own header, and it keeps a visible placeholder to re-read the golden against the original Transactions scan if the owner ever supplies the PDF. Values are typed from a source that was actually open on the desk, never recalled from memory. That is the standard this academy holds its own numbers to, and it is a good standard to hold yours to.

## The misconception to avoid

The tempting shortcut is to treat the J-function as a unit conversion, as if dividing by $\sigma \cos\theta$ and multiplying by $\sqrt{k/\phi}$ were like converting psi to kPa, guaranteed to work by definition. It is not. The collapse is a physical hypothesis about pore geometry, and it can fail. When two samples refuse to share a curve after correct scaling, the data is telling you they do not belong to the same rock family, and averaging them anyway builds a fiction. The J-function is a test that rocks must pass, not a courtesy extended to them.

## Exercise

First, without any numbers: a colleague argues that since finer rocks have higher capillary pressure, the tightest plug must carry the highest J values too. Say what is wrong with that expectation if the plugs share one pore geometry family, using the two-multiplier argument above.

Second, plug EK3-P was measured with mercury as the invading fluid and reads about six times higher in pressure than plug EK1-P at every saturation. State the two places in the J formula where that factor of six will be absorbed, and what should remain once it is.
