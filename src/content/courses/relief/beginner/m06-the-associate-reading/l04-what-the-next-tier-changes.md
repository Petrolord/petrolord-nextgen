# What the next tier changes

One thing changes at the Professional tier and it changes everything downstream of it. The load stops being an input.

## Where the load comes from

The fire case is the one route in this module that computes its own relief load, and the Professional tier takes it apart from the beginning. It starts with geometry: the wetted area of a vessel holding liquid, worked out exactly in both orientations, because a vessel lying down and one standing up present different areas to a pool fire at the same level.

From the geometry comes a duty, and from the duty comes a load in pounds an hour. The duty carries two published constants, one exponent and one credit, and which of the two constants applies depends on an answer about drainage that the caller supplies. There is a height at which the wetted area is truncated, and trimming the level to it is the caller's job, which arrives as a note on every duty.

Then the tier runs the whole chain end to end, from a vessel and a fire to an orifice letter, which is the first time a letter comes out with no load typed in anywhere.

## Where the liquid goes

The second half of the Professional tier follows what leaves the valve. Droplets settle at a velocity set by drag against weight, iterated. This academy answers that question in three places, so the tier names the other two rather than deriving the balance again. A horizontal knockout drum then keeps liquid out of the flare header, and the same circular segment that decided the wetted area turns up again deciding both how much vapour space there is and how far a droplet has to fall.

## What the Expert tier adds

A vessel emptying itself. Mass out through a choked orifice while the inside expands, marched in steps, with a closed form of the same balance drawn over it as a check. A customary depressuring time read off a curve, and the orifice that buys it. A step size treated as part of the answer. The point source of radiation asked in both directions.

Then the audit: what is computed, what is typed, and what the published cases cannot discriminate. The tier closes with one module given over entirely to the engine's own repair history, framed as history in its own title and in its first line, so a reader can never mistake it for current behaviour.

## What belongs to other courses

Five subjects touch this one and are taught elsewhere, and the later tiers hand each back by name. The flare setback and the customary allowable radiant intensities belong to the separation course, which grades a setback. Critical flow through an injection port belongs to gas lift. The droplet terminal velocity balance belongs to the gas well course and to separation. Cooldown and no touch time belong to flow assurance. What a knockout drum is for belongs to gas processing.

Knowing where a subject lives is part of knowing the subject.

## Exercise

Write down the one thing that changes at the Professional tier and list the four steps between a vessel in a fire and an orifice letter. Then name the five subjects this course hands to other courses, and the course that owns each.
