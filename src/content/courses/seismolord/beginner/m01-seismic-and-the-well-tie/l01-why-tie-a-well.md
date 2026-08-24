# Why tie a well

A well and a seismic survey tell you about the same rock, but they disagree about almost everything else. The well is precise and local. The survey is approximate and everywhere. The well tie is the piece of work that makes the two speak to each other, and until it is done you are holding two datasets rather than one interpretation.

## Two measurements, two coordinate systems

A wireline log measures physical properties of rock at the borehole wall: radioactivity, bulk density, how fast sound travels through the formation. It samples them every half metre or so, in depth, along one line through the earth. When a petrophysicist calls a top at 1580 m, that number is a measurement, accurate to a fraction of a metre, and it refers to a specific bed.

A seismic survey measures something quite different. It records energy that has travelled down from a source, bounced off interfaces in the subsurface, and returned to receivers at the surface. What comes back is a trace of amplitude against travel time, not against depth. A reflection sits at 1582 milliseconds, and where in the ground that is depends on how fast the rocks above it transmit sound. Seismic also averages heavily: a seismic wavelet is tens of metres long, so thinner features are blurred together rather than resolved individually.

So the two datasets live in different coordinate systems. The well is in depth and resolves metres. The seismic is in time and resolves tens of metres. Neither is wrong. They simply cannot be overlaid without a translation step.

## What the tie actually establishes

Tying a well means answering one question with evidence: which seismic reflection corresponds to which geological surface?

That sounds modest. It is the hinge on which most of subsurface interpretation turns. Once you know that the strong trough at 1582 ms is the top of your reservoir sand, you can follow that reflection away from the well across the whole survey, through parts of the basin where nobody has ever drilled. Every horizon map and every volume estimate downstream of that decision inherits it. Get it wrong by one loop and you have mapped the wrong surface with complete internal consistency, which is far more dangerous than mapping nothing at all.

Three specific jobs depend on the tie:

* **Mapping a horizon honestly.** You cannot carry a well top across a survey until you know which reflection carries it. Picking the visually strongest event and hoping is not interpretation.
* **Converting time to depth.** A time map becomes a depth map only through a velocity model, and the tie is where the well tells you what the velocities really are along its path.
* **Trusting an amplitude anomaly.** A bright spot is interesting only if you know what rock it sits at. The tie tells you whether the bright event is at your reservoir level or forty milliseconds above it in a shale.

## Where this sits in the workflow

It helps to see the whole geoscience path as a chain of coordinate systems.

Petrophysics works at the well, in depth. Shale volume, porosity and saturation are computed sample by sample down a borehole, and every one of those numbers is anchored to a depth. Well correlation also works in depth: tops are carried from well to well by matching log character, and the result is a set of surfaces known precisely at a handful of points.

Seismic interpretation works between the wells, in time. It fills the space that the boreholes do not sample, but it only ever knows that space in travel time and at coarse resolution.

The synthetic seismogram is the translator between those two worlds. It is built entirely from well curves, sonic and density, and converted into the seismic domain: depth becomes two-way time, rock properties become reflection coefficients, and the reflection series is filtered to seismic bandwidth by a wavelet. The result is a trace that a well produced but that looks like seismic. Laying it beside the real seismic trace at the well location, and matching the two, is the tie.

This is why Seismolord sits above Well Data Manager on the ladder and not beside it. A synthetic is only as good as the sonic and density curves it is built from. If DT is spiky through washouts, or RHOB was recorded in the wrong units, or nulls were read as real values, the synthetic will be wrong and the tie will be wrong, and neither will announce the problem. The gatekeeping discipline you learned on well data is the foundation this course builds on.

## What this tier will and will not do

The Beginner tier is synthetics-first. You will build a synthetic seismogram end to end from the teaching well, one stage per module, and learn to read the summary panel it produces. You will not yet load a real seismic volume, correlate the synthetic against a real trace, or apply a stretch and squeeze. Those are the Associate and Professional jobs. The reasoning is straightforward: you cannot judge whether a synthetic matches seismic until you understand exactly what the synthetic is made of and which of its numbers you chose. This module builds that understanding.

## Exercise

In your own words, write three sentences: one stating what a well measures and in what coordinate system, one stating what seismic measures and in what coordinate system, and one stating what the synthetic does about the difference. As a self-check, the first should mention rock properties in depth at high resolution, the second should mention reflected energy against two-way travel time at coarse resolution, and the third should say that the synthetic is built from well curves but expressed in time, which lets it be compared with seismic directly. Then name one consequence of tying to the wrong reflection, and say why that error is harder to catch than simply having no tie at all.
