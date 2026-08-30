# Lock-up

The limit that is not a gradual degradation.

## The mechanism

Past the helical limit the pipe wraps around the hole. A helix under compression presses OUTWARD against the wall, and the outward force grows with the compression.

More outward force means more normal force means more friction. More friction means the load applied at surface arrives at the bit even more attenuated, so more has to be applied, so the compression grows, so the wrap tightens.

That is a positive feedback loop, and past some compression its gain exceeds one.

## What it looks like on a rig

The driller slacks off and the hookload drops as expected. The weight on bit does not rise.

Slacking off further drops the hookload further and still nothing arrives at the bit. Eventually the hookload has fallen a long way, the string is wound into the hole, and the rate of penetration is zero.

Working the string, rotating it, or picking up and reseating it are the responses, and they work by breaking the helix.

## Why the model cannot predict it

Because the model's friction does not depend on the buckling state.

To predict lock-up the model would have to compute the contact force of a helically buckled string, which depends on the pitch of the helix, which depends on the compression and the clearance, and then feed that back into the friction. That is a different and much harder calculation, and it is genuinely nonlinear: the solution can cease to exist, which is what lock-up is.

## What the model can tell you

Where the compression passes the helical limit, and how far past it goes.

A string that never passes it will not lock up. A string that passes it deeply will. In between, the model is telling you there is a risk without being able to size it.

That is a useful output as long as it is read as such.

## Lock-up is a length limit, not a force limit

The important consequence for design: for a given hole, string and friction factor, there is a maximum lateral length beyond which weight cannot be transferred at all.

Adding surface weight does not extend it. Beyond that length the answer is a different string, a different mud, a tractor, or a shorter lateral.

That is a hard limit rather than an economic one, and it is what "the reach limit" means in extended reach drilling.

## The way out

**Do not slide.** A rotating string has most of its friction in the tangential direction, so the axial component that drives the buckling is much smaller. Rotary steerable systems avoid the problem rather than solving it.

**Heavier pipe in the lateral.** More weight per metre raises both buckling limits and improves weight transfer.

**Lower friction.** Directly reduces the compression needed.

**A tractor.** Pulls from the front instead of pushing from behind, which removes the compression entirely.

## Exercise

Explain, using the two velocity direction cosines from the Professional tier, why rotating the string while sliding improves weight transfer.

Then say why rotary steerable systems make the problem disappear rather than reducing it.
