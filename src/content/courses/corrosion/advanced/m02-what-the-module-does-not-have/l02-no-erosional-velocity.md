# No erosional velocity

This engine has no erosional-velocity criterion. It computes a wall shear, the wall shear carries a coloured risk word, and a reader who has met a velocity limit before will reach for that pairing as though it were one. The two are unrelated, and the confusion is worth an Expert lesson because acting on it means reading a number as a limit that it does not express.

## Who owns the criterion

The erosional velocity criterion is owned by the Casing and Tubing Design course at its Expert tier, and it is cited again in Nodal Analysis and in Gas Well Deliverability. That is where the quantity is taught, that is where its form and its limits belong, and this lesson does no more than name the owner. A second derivation here would be a second answer to a settled question.

## What this module computes instead

The wall shear in this module answers one question: whether a corrosion inhibitor film survives on the steel. It is built from this module's own Reynolds number and this module's own friction factor, and the Pipeline and Line Sizing course computes both of those with a different correlation and a different laminar to turbulent transition, so the two will not agree on the same pipe. The engine says as much in its own docstring.

The shear then meets two thresholds, the 100 Pa film stripping threshold and the 50 Pa moderate band, both of which are held. Above the higher one the film is taken to be stripped and the corrosion inhibitor credit is removed from the rate. That is a chemistry verdict about a film, and it has nothing to say about metal removed mechanically.

## Mechanical erosion is absent altogether

Mechanical erosion means wall loss from entrained solids or from liquid impingement. This module does not model it at all. There is no sand rate, no particle size, no impingement angle and no erosional wall loss anywhere in the calculation. The one rate the engine returns is a general uniform corrosion rate, and the engine names that limitation itself in `NOT_PROVIDED` alongside the missing erosional-velocity limit.

So a line that passes every check in this studio may still be eroding, and the module has no way to tell you, because it has no localised or mechanical model to compare against. A learner who reads the low risk word as clearance on velocity has taken a film survival verdict for a velocity limit.

## The vocabulary rule that goes with this

The word erosion already carries a different meaning in the Academy. In the Basin Modelling course it is a geological process: material removed from a sedimentary column over geological time, which changes a burial history. Nothing in that sentence is about steel. This course therefore writes mechanical erosion or erosional wall loss every time, and every use carries the statement that this engine has no erosional-velocity criterion.

## Exercise

Take the shipped case and record its wall shear and its film risk word, then record the two held thresholds those turn on. Write one sentence saying what the risk word commits the engine to. Then name the course that owns the erosional velocity criterion and say what you would have to go there for.
