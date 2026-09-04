# Three node kinds

A gathering system here has exactly three kinds of node, and anything a real field has that is not one of them has to be written as a branch relation or left out.

{{panel:pd-trunk-explorer}}

## What each kind does

A well injects mass and its pressure is unknown. A junction injects nothing, and everything arriving leaves. A sink has a fixed pressure and takes whatever arrives. `buildNetwork` accepts well, junction and sink, and nothing else.

AGBADA WEST carries all three: eight nodes, eight branches, one delivery point, seven pressures nobody typed.

| Node | Kind | Branches on it |
| --- | --- | --- |
| t1, AGBADA-2 | well | 1 |
| t2, AGBADA-6 | well | 1 |
| t3, AGBADA-9 | well | 1 |
| t4, AGBADA-12 | well | 1 |
| ha, North manifold | junction | 5 |
| hb, Loop tee | junction | 3 |
| hc, Trunk tee | junction | 3 |
| sep, Separator | sink | 1 |

## The sink is the boundary, not another node

The separator sits at 265 psia. That is the only pressure in the drawing anybody supplied, and it is what the rest is solved against. Eight nodes with one sink leaves seven unknown pressures, so the size of the problem is set by how many nodes are not the boundary.

A junction stores nothing: no inflow, no capacity, no inventory. Five branches meet at the north manifold, and the only statement the module makes there is that what arrives leaves.

## What has no node kind at all

There is no pump, no compressor and no choke as a node kind. Ask for one and the answer is a refusal: `ok = false`, `Node "K-1" has kind "compressor", which is not one of well, junction, sink.`

The list of things the module does not model at all is longer. Temperature anywhere, so no thermal coupling. Slugging, holdup and any transient, because every equation here is steady state. Compressibility along a branch, since mass in equals mass out on every branch by construction. And a separator that does anything except accept whatever arrives at a fixed pressure.

One floor sits under all of it: `MIN_PRESSURE_PSIA = 14.7 psia`, below which no node is allowed.

## The mistake

Drawing the compressor station, or the choke, or the test separator, as a node because that is how it appears on the P and ID. A device between two nodes has to become part of the branch relation between them: somebody writes it as a flow against a pressure difference and hands it in, or the drawing leaves it out and says so.

The second version is treating a junction as a place production can pile up. Mass is the currency, and a junction balances it exactly.

## Exercise

List the eight nodes of AGBADA WEST with their kinds, then count how many pressures the solver has to find.

Then name one piece of equipment on a gathering system you have seen and say whether it is a branch relation or a thing this module leaves out.
