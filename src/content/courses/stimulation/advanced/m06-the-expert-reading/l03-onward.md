# Onward

Four things a real stimulation design does that this tier did not, and where each one goes.

## Real proppant transport

This tier placed the proppant by bookkeeping. The mass that was pumped became a uniform pack over the whole fracture, thinned only by a single damage factor of 0.5.

Proppant does not do that. It settles while the fluid is still moving, it convects when the slurry is denser than the pad ahead of it, and it bridges where the width closes below a few grain diameters. What you get is a bank near the bottom, a tip that never sees the last stage, and a conductivity that varies along the fracture instead of being one number.

The next step is a transport model that carries a concentration field through the fracture, and a conductivity that is a profile rather than a constant.

## Height growth in three dimensions

Every calculation in this tier used one fixed height. The models the tier taught, PKN and KGD, both assume it, and the optimum inherits that assumption at every half-length.

Real fractures grow into the layers above and below wherever the net pressure exceeds the stress contrast holding them in. That costs you the fluid and the proppant that go out of zone, and it can put the fracture into water. Pseudo-three-dimensional and planar three-dimensional models take a stress profile against depth and solve height, length and width together.

The input that matters most there is the stress profile, and it comes from a geomechanics log, not from the fracture model.

## Matching the treatment pressure

Everything here was forward modelled. Nothing was ever held against a job record.

The discipline that closes that loop is pressure matching. A minifrac or diagnostic injection gives you a real leakoff coefficient and a real closure pressure rather than assumed ones, and the log-log slope of net pressure during the main treatment tells you which of the regimes the fracture is actually in, contained extension, height growth, or a screenout in progress.

A design that has not been matched against a pumped job is a hypothesis. That is not a criticism of the design, but it is how it should be labelled.

## The economics

The optimum in module 5 maximises productivity for a fixed proppant volume, and the proppant volume is the one thing an engineer is genuinely free to choose. That decision is economic, not physical.

It needs the cost of the proppant and the horsepower to place it, the incremental production the skin buys, the decline on that production, and a price. The answer is a job size, and the physics optimum is what you apply after the size is settled.

Most disagreements about fracture designs turn out to be disagreements about this, dressed as disagreements about half-length.

## The habit to carry

The chain in this tier is the skeleton. Everything above adds flesh to one of its links, transport to the pack, three dimensions to the geometry, field pressure to the calibration, money to the choice of size.

When you meet a more capable model, find which link it improves. That tells you what it will and will not change about the answer you already have.

## Exercise

First, for each of the four topics in this lesson, name the link of the tier's chain it improves.

Second, take a design you have seen or one from the panel and write the two sentences you would add to it saying what has not been matched against field data.
