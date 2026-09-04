# What an index is for

A valid network is indexed rather than copied, and the index is what every later function reads. `buildNetwork` builds it and never computes a pressure.

{{panel:pd-trunk-explorer}}

## What the index holds

The build on AGBADA WEST returns `ok: true` with 8 nodes, 8 branches, 7 unknown pressures and 1 delivery point, and lists the unknowns in the order the solver will use: t1, t2, t3, t4, ha, hb, hc.

| Node | Kind | Branches on it |
| --- | --- | --- |
| t1, t2, t3, t4 | well | 1 each |
| ha, North manifold | junction | 5 |
| hb, Loop tee | junction | 3 |
| hc, Trunk tee | junction | 3 |
| sep, Separator | sink | 1 |

The separator is the one node missing from that list, because its pressure was supplied. Eight nodes with one delivery point leaves seven, and seven is the size of the problem.

## Why the count and the adjacency are the same fact

Each unknown node contributes one mass balance, so the solve is seven equations in seven pressures. The branch count is how many terms a node's balance has: five flows have to add to nothing at the north manifold, and a well's balance is its inflow against its single flowline.

The unknown order is also the column order the solve works in, and the dense linear solve pivots on it. Reverse the node array, which changes no physics, and the unpinned pressures move by at most 1.1369e-13 psia. That is what a bookkeeping order is allowed to be worth. The one pinned node moves by 5.4710e-9 psia, a different kind of number under the same label.

## Three refusals that exist only so an index can be built

`Two nodes share the id "w".` An index cannot carry two rows under one name. `Branch "a" ends at "ghost", which is not a node.` A branch end has to resolve to a row. `Every node needs an id.` A row with no name cannot be looked up downstream.

None is about pressure or flow. They are about whether the drawing can become a table at all.

## The mistake

Reading `unknown pressures = 7` as a count of wells, or as a count of things to be measured. It is a count of nodes whose pressure nobody supplied, and it includes every junction.

The second is renaming a node between the build and the read. The index is keyed on the id, so a rename separates a pressure from the node it belongs to and nothing complains.

## Exercise

Write the seven unknowns of AGBADA WEST in index order, say which node is absent and why, and give the number of terms in the north manifold's balance.

Then say what would change the unknown count to six without removing a node.
