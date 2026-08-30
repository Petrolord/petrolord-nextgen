# A constant gradient, and what it hides

The simplification, examined.

{{panel:gm-stress-explorer}}

## The claim

This profile says the overburden is 2300 kg/m3 of equivalent mud weight at 50 m and 2300 kg/m3 at 2600 m and 2300 kg/m3 everywhere in between.

## What that means physically

That the average bulk density of everything above a depth is 2300 kg/m3, at every depth.

For that to hold, the rock at 50 m would have to have the same density as the rock at 2600 m, which it does not. Real sediment compacts: porosity falls with depth, and bulk density rises with it.

## The real shape

A real overburden gradient is a curve. It starts low, because the shallow sediment is porous and full of water, and rises towards an asymptote as the pore space closes.

Plotted as an equivalent mud weight against depth, it looks like a hockey stick lying on its back.

## Where the difference is worst

At the top, always. The gradient at 100 m is an average over 100 m of the softest rock in the well, and a constant value assumes it is the same as an average over 2600 m.

By the time the integral has 2000 m of compacted rock in it, one assumption or the other about the top 100 m barely moves the answer.

## Two consequences in this course

**Everything shallow is suspect.** The stresses computed above about 1000 m in this profile inherit the error and add their own.

**Everything deep is fine.** The 2500 m and 2600 m numbers are as good as the constant gradient assumption ever gets.

## Why the fixture keeps the simplification

Because the course is about what happens to a hole in a stress field, not about building an overburden curve. Holding the overburden simple makes the horizontal stress calculation legible: every change in the answer is attributable to the parameter that was changed.

A course fixture and a field study have different jobs, and this is a fixture.

## What to carry into the field

Ask where the overburden came from before using any output that depends on it, which is all of them.

If the answer is a constant gradient, ask what depth range it was calibrated over, and treat everything shallower than that as indicative.

## Exercise

Sketch a realistic overburden gradient against depth for a well in 100 m of water, and mark where a constant 2300 kg/m3 line would sit above and below it.

Then say at what depth the two would cross, and what that crossing depends on.
