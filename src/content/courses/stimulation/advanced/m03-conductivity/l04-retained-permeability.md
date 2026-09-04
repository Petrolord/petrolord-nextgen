# Retained permeability

Closure takes the first bite out of the pack. The fluid you pumped takes the second, and only what survives both is worth anything.

{{panel:st-pack-explorer}}

## Two different losses

The catalogue value already accounts for the load the rock puts on the grains. It says nothing about the fluid that carried those grains into the fracture.

A crosslinked gel does not vanish at the end of the job. Unbroken polymer, filter cake residue and trapped fluid sit in the pore space of the pack and block part of it. Fines generated at the grain contacts add to the blockage. The engine folds all of that into one multiplier called the damage factor.

The published job uses a damage factor of 0.5. Half of the permeability the catalogue promised is gone before the well produces a barrel.

## The number the engine carries forward

The engine computes a retained permeability as the catalogue value times the damage factor, and it uses only the retained value when it forms conductivity. For the published job the retained permeability is 6.512770069532134e-11 m2, which is 65.990641 darcy, against roughly 131.98 darcy read from the table at the published closure.

Conductivity then follows as retained permeability times propped width, giving 9.84433461550515e-14 m3. Every downstream number in this course, the dimensionless conductivity of 0.6649847808507611, the pseudo-skin, the effective wellbore radius, descends from the retained figure and not from the catalogue figure.

That is why the retained number is the only one worth quoting. A conductivity claimed on undamaged laboratory permeability is a marketing number. The well produces against the retained one.

## What the engine will not accept

The damage factor must lie in the interval greater than zero and up to and including one. Hand it zero, a negative value, or anything above one and the engine throws rather than computing, because a multiplier above one would claim the treatment improved the pack and a multiplier of zero would claim the fracture is dead. A damage factor of exactly one is allowed, and it means an undamaged pack, which is a laboratory condition and not a field one.

## Exercise

Starting from the catalogue permeability at the published closure, apply the published damage factor and confirm you reach 6.512770069532134e-11 m2.

Recompute the conductivity assuming a perfectly broken fluid with a damage factor of one, and say what that does to the dimensionless conductivity relative to 1.6.

Explain in one sentence why a vendor conductivity quoted without a damage factor cannot be compared with the published 9.84433461550515e-14 m3.
