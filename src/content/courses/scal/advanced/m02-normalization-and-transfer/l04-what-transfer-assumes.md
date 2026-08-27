# What transfer assumes

Normalization and scaling are arithmetic, and arithmetic always works. The question a professional asks is not whether `scaleKrTable` will produce a table, because it will, but whether the table means anything. A shape transfer is a physical claim wearing a mathematical costume, and this lesson states the claim outright so you can recognize where it fails.

## The claim, in three parts

Carrying a normalized shape from plug to target asserts that the two rocks share the pore-scale physics that sets curvature. Unpacked, that is at least three assumptions.

Same rock fabric. The Corey exponents encode how the wetting and non-wetting phases partition a pore network as saturation changes. A well-sorted sand and a microporous carbonate partition differently, and no endpoint adjustment reconciles them. Transfer within a facies is an interpolation; transfer across facies is a guess.

Same wettability. The exponents and the endpoints both shift when the rock's surface chemistry shifts. A plug cleaned aggressively in the lab can drift toward water-wet behavior that the reservoir does not share, and a transfer then propagates a laboratory artifact into every cell of a model. When wettability is in doubt, the shape is in doubt.

Same displacement direction. Relative permeability carries hysteresis: the imbibition curves that govern a waterflood differ from the drainage curves measured on the way into the experiment. The Ekene curve set is an imbibition set matched to its flood, and the thin-real lock you met in the Professional tier applies here too: the engine models no hysteresis, so the branch you feed it is the branch it believes. Transferring a drainage shape into a waterflood model is a direction error no normalization can repair.

## The second system

Everything so far concerned oil and water. The engine carries a second two-phase family for gas displacing oil at connate water, `coreyKrGasOil`, built on the normalized gas saturation

$$S_{gn} = \frac{S_g - S_{gc}}{1 - S_{wc} - S_{org} - S_{gc}}$$

with $k_{rg} = k_{rg,max} S_{gn}^{n_g}$ and $k_{rog} = k_{rog,max} (1 - S_{gn})^{n_{og}}$. The structure rhymes with the oil-water set, and that rhyme is precisely the trap: the exponents belong to their own fluid pair. Gas is strongly non-wetting almost everywhere, its critical saturation $S_{gc}$ has no oil-water counterpart, and a gas-oil $n_g$ says nothing about a water-oil $n_w$ measured on the same plug. Normalization lets you compare curves within a system; it never licenses moving shapes between systems.

The lock to remember: the engine is two-phase by design, oil-water or gas-oil, never three phases at once. No three-phase model is offered, so nothing in this course teaches one, and a workflow that needs one has left the territory this engine honestly covers.

## Declaring the assumptions

The difference between a defensible transfer and a hidden one is a sentence in the report. A defensible curve set for an unmeasured region reads like a chain of custody: shape from plug EK3-P, imbibition branch, oil-water system, endpoints assigned from the log model, exponents assumed constant across the facies on the evidence of the plug overlay. Every clause is checkable, and every clause names a way the curves could be wrong. A table with no such sentence is not more certain; it has only hidden its uncertainty where a reviewer cannot price it.

That is the discipline this module adds to the toolkit: not new equations, but the habit of stating which frame is measured, which shape is borrowed, and which physics is assumed shared.

## The misconception to avoid

The most common transfer error is treating normalization as evidence. The fact that two curve sets can be normalized onto the same axis proves nothing, because every valid table normalizes. Evidence is when independently measured plugs agree after normalization, as in lesson 3. Transfer borrows that evidence; it never creates it. A one-plug program has one shape and no test of it, and a model built on it should say so.

## Exercise

First, a colleague proposes filling a gas-cap region of a model by transferring the Ekene oil-water shape into the gas-oil system, arguing that normalization makes the curves dimensionless and therefore portable. Name the specific assumption this violates and the structural feature of the gas-oil Corey set that has no oil-water counterpart.

Second, write the one-sentence chain of custody for a curve set built by scaling the Ekene 13-row grid onto endpoints from a log model in an undrilled fault block, and underline the clause you consider most likely to fail there.
