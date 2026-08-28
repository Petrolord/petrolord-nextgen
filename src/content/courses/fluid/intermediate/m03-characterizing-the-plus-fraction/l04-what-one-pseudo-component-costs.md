# What one pseudo-component costs

The design decision stated plainly, with its consequences on both sides.

## The decision

The engine represents everything heavier than C6 as a SINGLE pseudo-component, characterized from the reported molecular weight and specific gravity.

The alternative is splitting: fit a distribution to the heavy end, cut it into three or six or twelve pseudo-components, and characterize each.

## What splitting buys

**Better behaviour near the critical region.** A single lump has one critical temperature, so it cannot represent a heavy end whose components differ widely in volatility. Near the critical point that matters.

**Better condensate behaviour.** Retrograde liquid dropout depends sensitively on the heavy tail, and one lump smears it.

**Better liquid densities**, sometimes, because the volume shift correlation behaves better on narrower cuts.

## What splitting costs

**Unmeasurable choices.** Which distribution, how many cuts, where to put them. None of these is constrained by anything the laboratory measured, and different choices give different answers.

**More parameters to tune.** Six pseudo-components have six sets of properties, and a regression with that much freedom will fit anything, including the noise.

**A model nobody can check.** A split that reproduces the study perfectly may be doing so by construction rather than by physics, and there is no independent way to find out.

## Why the engine chose one

Because it uses exactly what was measured and invents nothing beyond the characterization correlations. Every number in the pseudo-component traces back to MW 218 and SG 0.8515 plus published methods.

And because for a black oil well away from its critical point, the extra fidelity of a split is not what limits the answer. Good Oil is such a fluid.

The decision is also honest about where it fails. The engine's own documentation says a full eleven-component fixture fluid comes out near-critical with retrograde behaviour at 200 F, and that a single pseudo has known limits there.

## What it costs on this fluid

The Professional tier measures it, and the next module reports it. The headline numbers:

Saturation pressure comes out about six percent high. Stock tank gravity comes out about nine API light. Total gas-oil ratio comes out a few percent high.

Those are the costs, quantified against a real measurement. Not a hand-wave about limitations, a number for each one.

That quantification is only possible because the fluid was measured. On Ekene, which was designed, the same model would produce the same kind of errors and there would be no way to know their size.

## The general principle

A modelling simplification should be stated, and its cost should be measured wherever a measurement exists to measure it against.

Both halves matter. A stated simplification with no measured cost is a caveat that a reader cannot act on. A measured error with no stated simplification is a mystery.

The pattern runs through this whole series: the simulation course stated its clipping convention and measured what the other one would give; the waterflood course stated its allocation and measured the out-of-zone volume.

## The misconception to avoid

"One pseudo-component is a beginner's simplification and real studies split." Real studies do both, and the split is a choice with its own risks rather than an upgrade. A six-component split tuned to four measurements has more freedom than data, which is a worse position to be in than a one-component model whose errors you have measured.

## Exercise

First, give two arguments for splitting the plus fraction and two against, and say which the engine chose and why.

Second, name the three quantified costs of the single-pseudo choice on Good Oil Well No. 4, and say why those costs could not have been quantified on the Ekene fluid.
