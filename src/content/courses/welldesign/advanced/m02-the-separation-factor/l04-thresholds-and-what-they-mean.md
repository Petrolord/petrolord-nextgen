# Thresholds, and what they mean

Two numbers that decide whether a well is drilled.

## The two

**1.0.** Below this the calculation says the two uncertainty envelopes, at the chosen confidence, overlap. The well is not drilled as planned.

**1.5.** Between 1.0 and 1.5 the well goes to review: additional mitigation, a revised plan, or an explicit management decision.

Above 1.5, clear.

## Why 1.0 is not the safe line

A factor of exactly 1 means the ellipses touch at k = 3.5. That sounds like a wide margin, and it is not, for three reasons from the Professional tier.

**The model excludes gross errors.** A survey blunder puts a well outside its ellipse entirely.

**The model excludes the offset's real history.** An old well's parameter set is a guess about a tool nobody has.

**The confidence factor is a convention.** k = 3.5 is not a calculated risk level; it is an agreed scaling of a model that is itself approximate.

So the industry sets the action threshold at 1.5, above the touching point, and treats 1.0 as the line beyond which the plan is simply not acceptable.

## What review means in practice

**Change the plan.** The cheapest mitigation: move the trajectory, change the kickoff, alter the azimuth through the close section.

**Reduce the uncertainty.** Gyroscopic surveys through the critical section, in-field referencing, multi-station correction, more non-magnetic spacing. Everything from the Professional tier's module 4, applied where the problem is.

**Reduce the offset's uncertainty.** Re-survey the neighbour if it is accessible, or find a better record of it.

**Manage it operationally.** Monitor while drilling, survey more often through the close section, and stop if the actual diverges from the plan.

**Shut in the offset.** If the neighbour is producing and the geometry is bad enough, it is shut in and depressured while the new well passes. That is expensive and it is done.

## Where the thresholds come from

Consensus and history rather than calculation. They are in operator standards and in industry guidance, they are broadly consistent across the industry, and they predate the current error model revisions.

Some operators use a third, higher threshold for particular situations: near a producing well with high pressure, or where the offset's position is a plan rather than a survey.

## The minimum is not the whole story

A well with one station at 1.42 and everything else above 3 is a different problem from a well that sits between 1.42 and 1.6 for four hundred metres.

The first is a point to watch. The second is a section drilled inside the review band, with more opportunities for something to go wrong. The ladder plot shows the difference and the minimum alone does not.

## What the engine returns

The status, the minimum factor, the thresholds it used, and a list of every station that fell below the review threshold with its depth and level.

That list is the useful output. It says where the problem is, not just that there is one.

## The misconception to avoid

"A separation factor above 1 means the wells will not collide." It means the modelled uncertainty envelopes do not overlap at the chosen confidence, using a model that excludes blunders, surface position beyond one term, hole enlargement beyond a fixed radius, and its own model error. The margin between 1 and 1.5 exists to cover exactly those, and it is not generous.

## Exercise

A scan returns a minimum separation factor of 1.35 at 640 m, with 180 m of the well between 1.35 and 1.6.

Write the recommendation you would make, listing the mitigations you would consider in order of cost, and say which piece of additional information would most change your answer.
