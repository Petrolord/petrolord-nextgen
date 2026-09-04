# Refusals, not repairs

`buildNetwork` turns away eleven distinct malformed drawings and repairs none. Every refusal has an obvious repair, and every repair invents a fact about the field.

{{panel:pd-trunk-explorer}}

## What a repair would have to invent

`This node has no route to a delivery point: Manifold B. Nothing sets its pressure, so the network cannot be solved. Connect it or take it out.` The repair is to hang that node off the nearest header. It invents a branch with a conductance nobody measured, and every pressure downstream of it is an answer about a system that does not exist.

`The delivery point "Sep" needs a pressure. It is the boundary the whole system is solved against.` The repair is to default the pressure. A gathering system is solved against exactly one pressure somebody supplied, so defaulting it means every psi in the result is measured from a number nobody typed.

## Two families, one answer shape

Five of the eleven ask whether the drawing can carry production at all: no nodes, no wells, no delivery point, a delivery point with no pressure, and a node with no route to one.

The other six ask whether it can be read: `Two nodes share the id "w".` `Branch "a" starts and ends at the same node.` `Branch "a" ends at "ghost", which is not a node.` `Node "K-1" has kind "compressor", which is not one of well, junction, sink.` `Every node needs an id.` `Every branch needs an id.`

Both come back the same way, `ok: false` with a sentence naming the offending node or branch. No partial result, no best effort, no pressures.

## What is not refused

Three conditions arrive as warnings alongside an answer instead of in place of one: a pinned node, a solve that stalled before meeting its tolerance, and a solve that ran its iteration cap.

The gate's own pinning fixture prices it. A well whose inflow is a constant 2000 lb/d sits on a branch whose flow is a constant 1000 lb/d, so neither depends on any pressure. The result is `ok: true`, `converged: true`, `pinned: w`, a reported residual of 0.000000e+0 lb/d after 1 iteration, and the warning "One node carried nothing and nothing depended on its pressure, so it was left where it sits: w." `checkConservation`, run on that same answer, reports produced 2000.000000 lb/d against delivered 1000.000000 lb/d, a gap of 1000.000000 lb/d, relative 0.500000000.

A thousand pounds a day goes in and never comes out, under a residual of zero.

## The mistake

Treating `ok: false` as an obstacle to work around. A caller that edits the input until the build passes has moved a drawing error into the answer, where nothing names it.

The larger version is treating `ok: true` as a verdict on the numbers. It says the drawing could be indexed, or that an iteration stopped. Neither says mass balances.

## Exercise

Take three of the eleven refusals, write the repair each invites, and say what a solver that made it would have reported instead.

Then say why a pinned node warns rather than refuses, quoting the fixture's residual and its conservation gap together.
