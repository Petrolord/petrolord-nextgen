# What is measured, and what is estimated

Two of the six are guesses, and they are the two everything depends on.

{{panel:gm-stress-explorer}}

## The measured ones

**The sonic slowness** comes from a log. It is a direct measurement of how fast sound travels through the rock at the wall of the hole.

**The pore pressure** comes from direct tests where they exist and from a calibrated model where they do not. It is at least testable: a formation pressure tool reads it.

**The overburden** comes from integrating a density log from surface. That is arithmetic on a measurement rather than a model, and the main uncertainty is the shallow section where no log was run.

## The estimated ones

**SHmax and Shmin are not measured on a normal well.** There is no log for them.

Shmin can be bounded by a leak-off test or measured properly by an extended leak-off or a minifrac, and those are done rarely and at a handful of depths. SHmax is essentially never measured directly at all: it is inferred from breakout widths, from tensile fractures on an image log, or from a model.

## What this engine does about it

It estimates both from the overburden and the pore pressure using a poroelastic relationship with a tectonic strain term, then clamps the result to the limits that friction on existing faults allows.

Module 3 is that calculation in full. What matters here is the status of the answer: it is a MODEL OUTPUT, not a measurement, and it carries the uncertainty of every parameter that went into it.

## The strength is a third case

**UCS** is measured on core, and core is expensive and rare. Most of the time it is estimated from the sonic log using a published correlation, which is what this engine does.

So the sixth number is a measurement in principle and an estimate in practice.

## Why this matters more here than elsewhere

Because the mud window is a difference of two large numbers. The collapse and fracture pressures are both a few tens of megapascals and the window between them is often a few megapascals wide.

An error of ten percent in a stress moves each bound by several megapascals and can move the window width by a much larger fraction than that. A model whose inputs are half estimated does not produce a precise answer, and the honest use of it is as a screening tool that gets calibrated as the well is drilled.

## The calibration loop

Drill the top section. Watch what the hole does: breakouts on the caliper, losses at the shoe, cavings on the shakers. Adjust the model so it would have predicted what happened. Use the adjusted model for the next section.

That loop is how geomechanics is actually used, and it is why the first section of a well is the one drilled most conservatively.

## Exercise

Of the six numbers, rank them by how confident you would be in each on a well with a full log suite, no core and one leak-off test at the last shoe.

Then say which one you would spend money to improve first, and what you would spend it on.
