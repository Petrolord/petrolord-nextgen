# The derated burst

What the wall loss costs in pressure rating.

## Burst

The burst rating of a pipe is very nearly proportional to its wall thickness. Barlow's formula, which is what the industry uses, is

    burst pressure = 2 x yield x wall / diameter

so a 28 percent wall loss is about a 28 percent burst derating.

The engine applies exactly that: if a burst rating is supplied, it multiplies it by the ratio of remaining wall to nominal wall.

## Why that linearity holds

Because burst is a membrane stress problem: the pressure inside is resisted by hoop tension in the wall, and the hoop tension available is the yield stress times the wall area.

The formula's approximations are about the diameter used and the thin-wall assumption, and neither of them changes the proportionality to wall thickness.

## Collapse is different

Collapse resistance falls MUCH faster than proportionally, because it depends on the diameter-to-thickness ratio and, in the elastic regime, on its cube.

A 28 percent wall loss can take more than half the collapse rating, and the exact figure depends on which of the four collapse regimes the pipe is in, which depends on the ratio itself.

The engine does not compute a derated collapse, and that is a deliberate scope decision: it would need the full collapse formulation, the axial load in the casing, and the regime selection.

## Why the omission matters

Because the design case for a casing string is often collapse rather than burst.

A production casing evacuated during a well control event, or a string exposed to a depleted zone, is a collapse case. Deriving comfort from a burst derating on a string whose critical load is collapse is a mistake.

## What the wall loss also costs

**Fatigue life.** A groove is a stress raiser, and in a string that sees cyclic loading it is where a crack starts.

**Wear rate.** As the groove deepens the contact geometry changes, and the local contact pressure falls because the contact area grows. That is part of why deep wear is self-limiting.

**Connection integrity.** Wear near a connection can reach the seal area, and the connection's rating is not derived from the pipe body wall.

## The right output to hand over

The wall loss percentage and its depth, not a derated rating.

Deriving the ratings is the casing engineer's job, with their own formulas, their own load cases and their own safety factors. A torque and drag tool that reports a derated burst is being helpful; one that reports a derated collapse would be overreaching.

## Exercise

Take a casing with a nominal burst rating of 50 MPa and apply this course's worst wall loss to it.

Then look up a collapse formula and estimate the collapse derating for the same loss, and say by what factor the two differ.
