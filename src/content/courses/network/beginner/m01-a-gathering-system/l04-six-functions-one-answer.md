# Six functions, one answer

An answer out of this studio passes through six hands, and every number in it belongs to exactly one of them.

{{panel:pd-trunk-explorer}}

## Indexed before anything is computed

`buildNetwork` on the teaching network AGBADA WEST returns `ok: true` with 8 nodes, 8 branches, 7 unknown pressures and 1 delivery point, and indexes the unknowns in the order t1, t2, t3, t4, ha, hb, hc. Node ha, the North manifold, is a junction with 5 branches on it. Node hb, the loop tee, has 3, and hc, the trunk tee, has 3. Node sep, the separator, is a sink with 1 branch on it. Not one pressure has been computed at this stage, and `buildNetwork` will never compute one.

## Only one of the six iterates

`solveNetwork` on that same network asks a tolerance of 1e-12 with the iteration cap left at the module default of 200. It comes back `converged: true` and `ok: true` in 11 iterations with a reported residual of 1.546141e-11 lb/d and `pinned: t4`. The separator sits where it was told, 265.000000000 psia, and the trunk carries 12955.677150912 lb/d.

## What that answer was checked against

`checkConservation` run on the same answer reports produced 13300.677150912 lb/d against delivered 12955.677150912 lb/d, a gap of 345.000000000 lb/d and a relative 0.025938529000. The reported residual is the worst nodal imbalance over the unpinned nodes only, and the node it leaves out carries an imbalance of 345.000000000 lb/d by itself. `solveNetwork` does not call `checkConservation`, so both numbers only exist because somebody asked for the second one.

## Which function owns which number

| Function | What it returns |
| --- | --- |
| `pipeSchedule.js` | a bore, a wall, a yield, a K, a rating, an equivalent length |
| `buildNetwork` | node and branch counts, the unknown index, a refusal |
| `solveNetwork` | pressures, branch flows, well rates, iterations, a flag |
| `propagateStreams` | component rates split along the solved directions |
| `checkConservation` | produced, delivered, gap |
| `diagnose` | bottleneck, biggest drop, backflows, dead legs |

Nothing in `pipeSchedule.js` iterates and nothing in it knows there is a network. Every defect this course teaches is in the iteration or in something that was never compared with it.

## Exercise

In the panel, list the seven unknown nodes of AGBADA WEST in the order the solver indexes them, and say which of the eight is not in that list and why.

Then write the reported residual and the conservation gap side by side and say, in one sentence, which of the two is a statement about the answer and which is a statement about the iteration.
