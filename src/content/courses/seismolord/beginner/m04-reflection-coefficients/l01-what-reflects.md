# What reflects

Module 2 built an acoustic impedance log out of sonic and density. Module 3 put that log onto the seismic time grid. Neither module explained why impedance was worth building in the first place. This module answers that, and the answer is short enough to state before the reasoning: seismic energy responds to *changes* in impedance, so impedance was constructed precisely so that this module can difference it.

## Reflection is an interface event

Picture the downgoing pulse travelling through rock. As long as the acoustic properties ahead of it are the same as the properties behind it, the pulse carries on unchanged. Nothing comes back. The moment it arrives at an interface where the impedance on the far side differs from the impedance on the near side, part of the energy is turned around and sent back up, and the rest continues down.

So a reflection is generated *at a surface*, not *inside a body*. That single sentence has more practical consequences than any other statement in the Beginner tier, and each of them is worth spelling out.

## The size of the contrast sets the size of the reflection

Not every interface reflects equally. The proportion of energy sent back depends on how different the two impedances are. A large jump in impedance across a boundary returns a large reflection; a small jump returns a small one.

You can already see both cases in the teaching well's impedance log. Between 1600 m, where impedance is 5885.81, and 1650 m, where it is 8189.64, impedance climbs by more than two thousand units. Between 1500 m, where it is 5476.85, and 1600 m, the change over a hundred metres is only about four hundred units. If those pairs were adjacent samples, the first would reflect strongly and the second faintly. Across the whole log the values run from a minimum of 5436.47 to a maximum of 10624.956, so there is genuine variation to work with, but as the next lesson shows, the changes between neighbouring samples are far smaller than that full span.

## A thick uniform layer is silent in its interior

Take a layer whose velocity and density are constant through it. Inside that layer, impedance never changes, so no interface exists to reflect from, so nothing comes back from the interior. It does not matter whether the layer is 5 m thick or 500 m thick, and it does not matter whether it is a superb reservoir or a barren mudstone. The layer speaks only at its top and at its base, where its impedance meets something different.

This is why seismic behaves as an edge detector. A geologist looking at a core sees the body; an interpreter looking at a trace sees the two boundaries and infers the body between them.

## Three consequences worth carrying

**A reflection is a boundary event, not a layer property.** When you pick a horizon you are picking the interface between two rock volumes, and any amplitude you read there belongs to the pair, not to either rock alone. Saying "this sand has a strong amplitude" is loose talk; the strong amplitude belongs to the sand's contact with whatever sits above it.

**Two different rock pairs can give the same reflection.** If a shale over a sand and a limestone over a dolomite happen to present the same impedance contrast, they produce the same reflection. The wave has no way to report which rocks are involved, only how much their impedances differ. That is the fundamental non-uniqueness of seismic interpretation, and no amount of processing removes it.

**No contrast means no reflection, even across a real geological boundary.** A sharp, mappable, biostratigraphically important contact can be seismically invisible if the velocity and density on the two sides happen to multiply out to similar impedance. The absence of an event on a section is not evidence of the absence of a boundary. It is evidence only that the impedances match.

The converse also holds and matters commercially: a boundary of little geological interest can produce a bright, continuous, confidently mappable reflection simply because its impedance contrast is large.

## Why this closes module 2's loop

Impedance is the property that carries all of this. Velocity alone does not decide what reflects, and density alone does not either. The product of the two is what the wave feels, and the *difference* in that product across an interface is what the wave returns.

That is why the workflow order in this app is not negotiable. Sonic and density give velocity and density; their product gives impedance; the time to depth relationship puts impedance on the seismic clock; and only then can adjacent samples be differenced. The next lesson turns "the amount reflected depends on the size of the contrast" into an equation with a number attached.

## Exercise

A 30 m uniform sandstone sits between an upper shale of impedance 6000 and a lower shale of impedance 6000, in the same units as the teaching well. The sand's impedance is 7200. Describe in words what the reflectivity looks like through the interval, and say what happens to it if the sand's impedance were instead 6000. As a self-check: with the sand at 7200 there are exactly two reflections, one at the top where impedance rises and one at the base where it falls back, equal in size and opposite in sign, with nothing between them; with the sand at 6000 there is no impedance contrast at either boundary and so no reflection at all, even though the sand is still a real geological body with two real contacts. Then state in one sentence why an interpreter cannot conclude, from a blank interval on a seismic section, that the section is geologically uniform there.
