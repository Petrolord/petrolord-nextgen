# What this course will not certify

Five things this engine does not do, taught here and graded nowhere.

## Why state it

Because a course that teaches a topic implies it is worth learning, and a course that CERTIFIES a topic implies the learner can produce the answer and that the answer is worth producing. Those are different claims, and this series separates them deliberately.

The go-live migration for this course asserts the separation: it refuses to run if any graded field key names one of the topics below.

## Subsea and floating operations

The engine assumes a surface blowout preventer with no riser and no choke line. On a floating rig the choke line friction is tens of bar at a kill rate, and every casing pressure needs correcting for it.

The riser margin, the seabed BOP, the riser volume and the behaviour of gas at the stack are all outside this course.

## Gas migration and volumetric control

No time axis, no migration rate, and therefore no answer to how long a shut-in well can be held before the casing pressure reaches the MAASP.

Volumetric control is the procedure used while waiting and it is arithmetic done at the wellsite rather than a calculation here.

## Dissolved gas in oil-based mud

Gas dissolves in the base oil at depth, gives almost no pit gain and almost no casing pressure at shut-in, and comes out of solution suddenly high in the annulus.

That is a specific and well documented hazard, it changes what the shut-in readings mean, and there is nothing about it in this model.

## The casing pressure history

The engine produces the drill pipe schedule and says nothing about what the choke will read at any moment.

The kick tolerance calculation is the closest available: it asks whether the influx AT the shoe would fracture it, which is the peak of a history the model does not otherwise compute.

## Multiphase and dispersed influx behaviour

A single continuous bubble occupying the full annulus, isothermally expanded by Boyle. Real influxes are dispersed, mixed with mud, concentrated on the high side of an inclined hole, and partly dissolved.

## What IS certified

The static well control arithmetic on a surface-BOP well: the volumes and strokes, the shut-in interpretation, the kill sheet's four outputs and its schedule, the influx height and density and classification, MAASP, and single-bubble kick tolerance with both its cases.

That is the industry-standard calculation, it is what a well design and a kill sheet actually use, and stating its edges is what makes it usable by somebody who was not in the room.

## Exercise

For each of the five, name a well or an operation where it would be the thing that decided the outcome.

Then say which one you would implement first, and what data it would need that a normal well already has.
