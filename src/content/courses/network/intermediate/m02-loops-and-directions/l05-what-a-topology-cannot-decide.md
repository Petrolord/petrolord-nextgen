# What a topology cannot decide

`buildNetwork` validates and indexes and never computes a pressure. Everything a drawing settles is settled before it, and everything interesting is settled after.

{{panel:pd-network-explorer}}

## What it does settle

On the teaching network AGBADA WEST it returns ok = true with nodes = 8, branches = 8, unknown pressures = 7 and delivery points = 1. It fixes the index the solver will work in, t1, t2, t3, t4, ha, hb and hc, and it counts what sits on each node: ha carries 5 branches, hb 3, hc 3, and the separator 1.

It also settles what is illegal. Eleven malformed networks come back with ok = false and a reason rather than a repair, including "This node has no route to a delivery point: Manifold B. Nothing sets its pressure, so the network cannot be solved. Connect it or take it out." Solving such a drawing anyway would produce a confident answer about a system that does not exist.

## What it cannot settle: which way a branch runs

The crosslink on AGBADA WEST is drawn ha to hb and the solve returns -589.864625170 lb/d, so it runs the other way. Nothing in the topology could have predicted that. Walk the branch alone from 60 to 1400 lb/d per root psi in a derived sweep, not a published case, and the flow goes -346.749154, -510.593269, -571.240028, -589.864625, -595.655783 and -597.618496 lb/d. Same drawing every time.

## What it cannot settle: how a loop shares

On the golden case `looped` the topology is fixed and the split is not. A derived sweep of the midpoint leg alone gives that leg 24.634111 percent of the delivery at 60 lb/d per root psi, 34.514100 at 100, 49.637544 at the published 220, 55.550217 at 340, 58.833419 at 500 and 60.945870 at 800. One drawing, six answers.

## The mistake

Deciding an allocation, a metering point or a stream split from the drawing. Everything a gathering system does that is worth money is decided by pressures, and pressures come from an iteration that runs after the topology is already accepted.

## What it refuses at the far end

The topology can be legal and the solve still declines: "The system is singular: two or more nodes move together, so their pressures are not separately determined. That is usually a branch connected differently from the way the drawing suggests." A valid drawing is a precondition for a solve, never evidence of one.

And a converged solve on this accepted topology still reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345.000000000 lb/d, at a residual of 1.546141e-11 lb/d.

## Exercise

Build the teaching network in the panel and record the four counts it returns. Then delete one branch so that a well loses its route to the separator, and write down the exact refusal.
