# The wellbore is not the well path

A hole in the ground, and a curve in a computer, and the difference between them.

## Two different objects

The **wellbore** is a physical hole, roughly cylindrical, with a diameter, drilled by a bit that wandered a little, through rock that pushed back unevenly.

The **well path** is a mathematical curve through a list of survey stations. It has no diameter, it passes exactly through every station, and between stations it does whatever the calculation method says.

Every number in this course is about the second object. The first is what you actually drilled and nobody knows exactly where it is.

## Where they differ

**Between stations.** The path assumes a shape; the hole did whatever it did. Over thirty metres with a smooth assembly the difference is small. Through a sliding interval with an aggressive motor it is not.

**At the bit.** The survey sensors sit tens of feet behind the bit, so the last surveyed point is never the bottom of the hole. The projection ahead to the bit is exactly that, a projection, and it is where the well is being steered from.

**In diameter.** A 12 1/4 inch hole is 0.31 m across, and hole enlargement can double that. The anti-collision calculation in the Expert tier adds a radius for each well precisely because the path is a curve and the hole is not.

**In smoothness.** Real holes have spiralling, ledges and micro-doglegs the survey interval cannot see. They matter for torque and drag and for running casing, and they are invisible here.

## Why the path is still the right object

Because it is the only one you have, and because for the questions this course answers it is close enough:

- volumetric and geological questions need TVD, which is an integral along the path and is insensitive to small local wander;
- target intersection needs position at one depth, and the uncertainty model in the Professional tier explicitly accounts for what the path does not know;
- anti-collision needs the separation between two paths, plus a radius for each hole, plus an uncertainty envelope, all of which are in the calculation.

The honest position is that the path is a model, its error is quantified in the Professional tier, and the quantification is itself a published model with its own limits.

## The station list is the record

One consequence is worth stating plainly: the station list IS the well, as far as every downstream user is concerned. Logs are depth-shifted onto it, targets are declared hit or missed against it, neighbours are cleared against it, and reserves are booked on TVDs computed from it.

A station edited, a bad survey deleted without a note, a tie-on taken from the wrong reference, and every one of those downstream answers moves quietly.

## What a definitive survey is

Operators distinguish the surveys taken while drilling, which are used for steering, from the DEFINITIVE survey, which is the agreed record of where the well went. The definitive survey may be a gyroscopic run taken afterwards, may exclude stations rejected for quality, and is the one that goes into the well database.

Anti-collision against a neighbour uses the neighbour's definitive survey if there is one, and its plan if there is not, and those are very different things. The Expert tier returns to it.

## The misconception to avoid

"The survey is the hole." The survey is a set of measurements at points, and the path is a curve fitted through them. The hole is neither. Almost every surprise in directional drilling lives in the gap.

## Exercise

A well is drilled with a survey every 30 m and a sensor 15 m behind the bit.

At the moment a connection is made at 2000 m of drilled hole, write down the deepest depth whose position is known from a measurement, and the deepest depth whose position is known only from a projection. Then say which of the two the geologist is asking about when they ask whether the well is in the reservoir.
