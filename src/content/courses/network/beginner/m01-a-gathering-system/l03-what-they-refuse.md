# What they refuse

`buildNetwork` turns away eleven distinct malformed drawings with `ok: false` and a reason, and repairs none of them. What it declines to refuse is where the trouble is.

## Eleven refusals, each with its reason

| The drawing | What comes back |
| --- | --- |
| A node with no route to a delivery point | This node has no route to a delivery point: Manifold B. Nothing sets its pressure, so the network cannot be solved. Connect it or take it out. |
| No delivery point at all | A network needs a delivery point: a node with a pressure the system is flowing against. |

The other nine are the same idea: a delivery point with no pressure, no wells at all, a node whose kind is "compressor" rather than one of well, junction and sink, two nodes sharing the id "w", a branch "a" that starts and ends at the same node, a branch "a" ending at "ghost", a node with no id, a branch with no id, and no nodes at all. A drawing mistake is not a network with a small problem, so solving it anyway would produce a confident answer about a system that does not exist.

## The line module refuses in its own currency

A size that is not in the table returns null and never a nearby one: `scheduleRow(5, '40')` and `scheduleRow(6, '160')` are both null. `gradeYield('x55')`, `fittingK('elbow90')` and `roughnessOf('nonsense')` all resolve to NaN, as does a zero wall. An equivalent length asked for a fitting it does not have comes back `ok: false` with "No resistance coefficient for reducer." and one asked with nothing to work from says "An equivalent length needs a bore and a friction factor."

## What it warns about instead of refusing

Three things arrive as warnings carried alongside an answer rather than in place of one: a pinned node, a solve that stopped making progress before meeting its tolerance, and a solve that ran its iteration cap.

AGBADA-12 alone on its flowline is allocated 985 lb/d on a line that cannot pass more than 640 lb/d. The solve reports `converged: true` in 4 iterations with a reported residual of 0.0000e+0 lb/d, a wellhead of 303.714448989 psia, a rate of 985.000000000 lb/d, `pinned: t4`, and the warning "One node carried nothing and nothing depended on its pressure, so it was left where it sits: t4. That is what a shut-in well on a dead line looks like." `checkConservation` on that same answer reports a gap of 3.450000e+2 lb/d, relative 3.502538e-1.

## What it does not model at all

No temperature anywhere. No slugging, no holdup and no transient, because every equation is steady state. No compressibility along a branch. No pump, compressor or choke, because those are not node kinds.

## Exercise

Pick three of the eleven refusals and say what a solver that repaired the drawing would have reported instead.

Then say why the AGBADA-12 result is a warning rather than a refusal, quoting the residual and the conservation gap.
