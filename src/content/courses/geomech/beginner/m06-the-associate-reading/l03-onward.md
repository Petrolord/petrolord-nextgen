# Onward

What this tier certified, and what it hands on.

## What this tier certified

Building a 1D mechanical earth model: k0 from a Poisson ratio, the frictional limit ratio from a friction angle, the two horizontal stresses from the uniaxial poroelastic estimate with a tectonic strain term and a Biot coefficient, and rock strength from a sonic log through two published correlations.

## What it took as given

**The overburden**, as an integral of a density log done upstream.

**The pore pressure**, from the Pore Pressure course in the Geoscience module. This engine deliberately does not compute it, so that a geomechanics answer can never smuggle in a circular pore pressure argument.

## What it hands on

**To the Professional tier:** four stresses and a strength at every depth, which is exactly what the wall stress calculation consumes.

**To well control:** the fracture gradient that every MAASP and every kick tolerance is compared against, and the pore pressure gradient that sets the kill mud weight.

**To casing design:** the mud weight each section will need, which is half of the casing point argument.

## Three habits from this tier

**Ask whether a stress is a measurement, an estimate or a bound.** Estimates carry the model's uncertainty, bounds are one-sided and often loose, and the three get printed in the same font.

**Read the quality score and the clamp count before reading any output.** Both are cheap to compute and easy to skip, and this profile scores 80 for a reason worth knowing about.

**Convert to equivalent mud weight only at the end, and always with the depth attached.** The physics is in pressures and the decision is in mud weights, and the conversion is where the two meet.

## What is coming

The Professional tier drills a hole in this rock. The far-field stresses get rotated into the frame of the borehole, the Kirsch solution gives the stresses at the wall as a function of the angle round it, and two failure criteria turn those into a lower and an upper bound on the mud weight.

It also carries the one case in the course a third party can settle on paper: a vertical well whose collapse and fracture pressures both have closed forms, which the engine reproduces exactly rather than nearly.

## The one sentence

A mechanical earth model is six numbers at a depth, two of them are model outputs rather than measurements, and the model is honest enough to say when it has stopped believing itself.
