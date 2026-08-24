# What this tier adds

Two tiers of this course have been spent on a single well. The Associate tier built a synthetic trace from its sonic and density logs, and the Professional tier aligned that synthetic against an observed trace and measured how far out the tie was. Both tiers ended in the same uncomfortable place: the amplitude you read off a trace and the time you read it at both belong to the wavelet as much as to the rock, and neither tier could tell you by how much in advance.

This tier answers that question, and it answers it by giving up the well.

## From an observation to an experiment

A well tie is an observation. You take the rock you happen to have, the wavelet the processing happens to have delivered, and the geometry the earth happens to have arranged, and you look at what comes out. When something surprising appears, such as the 60 ms gap between the strongest reflection coefficient and the strongest amplitude in the Associate tier, you can explain it afterwards. What you cannot do is predict it, because too many things vary at once and none of them are under your control.

A **wedge model** is an experiment. You build a layer whose thickness is the only thing that changes, put a reflection at its top and another at its base, choose a wavelet, and then read the amplitude at every thickness in turn. Everything except thickness is held fixed by construction. Whatever the amplitude does as the layer thins is caused by thickness and by nothing else, because nothing else moved.

That difference is what makes this tier quantitative. The Professional tier told you that the wavelet moves your peak by up to 66 ms on this particular well. This tier tells you the thickness at which a bed stops being two reflections and becomes one, gives that thickness a number, and then checks the number against a result derived independently of the model.

## What you will build

The model is deliberately plain. A layer is thinned from 60 ms of two way time down to zero in 2 ms steps, giving 31 traces. Its top carries a reflection coefficient of $+0.08$ and its base carries $-0.08$, equal in size and opposite in sign. Every trace is convolved with a zero phase Ricker wavelet, first at 25 Hz and then at 40 Hz.

From that model you will read five numbers and calculate a sixth.

- The **tuning thickness** at 25 Hz, the thickness at which the composite amplitude is largest, which the model reports as 16 ms.
- The **peak amplitude** at that thickness, 0.1155947595834732.
- The **tuning thickness** at 40 Hz, 10 ms.
- The **peak amplitude** there, which is 0.1155947595834732 again, and the fact that those two amplitudes are the same number rather than two similar numbers is one of the results this tier exists to explain.
- The **isolated reflector amplitude** at the thick end of the 25 Hz wedge, 0.07999999821186066, which is the top coefficient on its own once the base is too far away to interfere.
- The **theoretical tuning thickness** for a Ricker wavelet, $\sqrt{6}/(2\pi f)$, which at 25 Hz is 15.593936024673521 ms.

Two of those fields are graded with no tolerance at all. The tuning thicknesses must be exactly 16 and 10, because they are readings off a 2 ms grid and there is no such thing as being nearly right about which sample the maximum sits on.

## What this tier will not do

It will not rebuild the synthetic. The Associate tier owns that, including the impedance log, the reflection coefficient series and the amplitude and time table at 15, 25 and 40 Hz. It will not rerun the correlation scan either, which belongs to the Professional tier. If you need those, they are behind you and unchanged.

It will also not pretend that a wedge is a piece of geology. A real bed does not have equal and opposite reflections at its top and base, does not thin at a constant rate, and does not sit under a wavelet you chose. The wedge is a measuring instrument for one effect. Module 6 is where the results are carried back to real data, with the conditions attached that make that carrying legitimate.

## The three results to carry

By the end of this tier three statements should be yours without looking them up.

**Below a certain thickness, seismic amplitude stops reporting reflection strength and starts reporting thickness.** That is the tuning effect, and the thickness at which it peaks is measurable.

**That thickness is a property of the wavelet, not of the rocks.** Change the reflection coefficients and the amplitude changes while the tuning thickness stays where it was. Change the frequency and the tuning thickness moves.

**The whole tuning curve depends on frequency and thickness only through their product.** That single sentence explains why 25 Hz at 16 ms and 40 Hz at 10 ms give identical amplitudes, and it is the reason this tier can be taught with two frequencies rather than twenty.

## Exercise

Write down, in your own words, the difference between the Professional tier's statement that the wavelet moved a peak by 66 ms on the teaching well and this tier's statement that the tuning thickness at 25 Hz is 16 ms. Say which of the two could be used to plan a survey and why.

As a self-check: the 66 ms is a measured symptom on one well under one set of conditions, so it describes what happened rather than what will happen, while the 16 ms is a property of a 25 Hz Ricker wavelet that holds for any equal and opposite pair under it, so it can be quoted before the data exists and used to decide whether a target bed is thick enough to be resolved at the bandwidth a survey is expected to deliver.
