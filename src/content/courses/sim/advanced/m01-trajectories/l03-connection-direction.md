# Connection direction

Every connection carries a direction flag: X, Y or Z. It is item 13 of a COMPDAT record, it is easy to leave at its default, and it changes the well index by a factor that is rarely small.

## What it means

The direction the wellbore passes through the cell. Z is a vertical well through a horizontal layer; X and Y are horizontal or near-horizontal passes.

## Why it matters

The well index depends on the permeability and the dimensions PERPENDICULAR to the flow into the well, and on the length of wellbore in the cell.

For a vertical well through a layer, flow converges radially in the horizontal plane, so the relevant permeabilities are the two horizontal ones and the relevant length is the layer thickness.

For a horizontal pass, flow converges in a plane containing the vertical, so one of the relevant permeabilities is the VERTICAL one, and the relevant length is the horizontal cell dimension.

Ekene's vertical permeability is a tenth of its horizontal. So a connection computed as Z when it should be X uses two horizontal permeabilities where it should use one horizontal and one vertical, and it overstates the well index substantially.

{{panel:sim-build-explorer}}

The connection table shows the direction on every row.

## The Ekene side-track is all X

Every one of its eleven connections reads X. That is worth pausing on, because the path also descends through all five layers, so an intuition that says "it goes down, so it should be Z" is available and wrong.

The reason is proportion. The path covers 500 m horizontally and about 10 m vertically, so within any single cell the horizontal component of the step dominates by more than an order of magnitude. The intersector assigns the direction the path spent most of its length travelling in, and that is X everywhere.

A path that dropped 30 ft while moving 30 ft laterally would produce a mixture, and a path that dropped through a layer while barely moving sideways would produce Z.

## Why X rather than Y

Because the path moves further east-west than north-south: 400 m against 300 m. Both components are large and the larger one wins.

That is a genuinely close call on this trajectory, and it is worth knowing it was close, because a slightly different toe would flip some connections to Y. Since the grid's two horizontal permeabilities are equal here, that flip would change nothing, but on a field with anisotropic horizontal permeability it would.

## The default

If the flag is omitted, most simulators assume Z. For a vertical well that is right and for a horizontal well it is badly wrong.

That makes it one of the most consequential defaults in a deck: a horizontal well whose COMPDAT records were written without direction flags is modelled as a stack of vertical penetrations, and its productivity is overstated by roughly the square root of the permeability anisotropy.

## The check

For any well with more than one column in its connection list, confirm the directions are not all Z. A deviated well that reports Z everywhere either has the flags defaulted or has an intersector that is not computing them.

## The misconception to avoid

"The direction is which way the well is heading." It is the direction the well passes through THAT CELL, and a single well can have different flags on different connections. A well that turns from horizontal to vertical carries X flags at the heel and Z flags at the toe, and the flags change where the trajectory does.

## Exercise

First, Ekene's horizontal permeability is ten times its vertical. Explain in two sentences why a connection flagged Z when it should be X overstates the well index, and roughly by what factor.

Second, the side-track moves 400 m east-west and 300 m north-south. State which flag it received and what would have to change for it to receive the other.
