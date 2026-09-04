# The stream mass nobody compares

`propagateStreams` carries a mass for every branch that the solver never computed, and nothing in the function compares the two.

{{panel:pd-fight-explorer}}

## Where the second mass comes from

The caller hands in `wellStreams[id]` with oil, water, gas and a `massLbD`. The propagation walks the solved flow directions and adds component rates along them, carrying the caller's mass with them. `wellRates[id]`, in the same result, is what the solve decided that well actually makes. One of those two numbers came out of an iteration and one was typed in by whoever ran the well test, and the module puts both in one object under the same word.

## The two masses on the teaching network

AGBADA WEST, four wells, three junctions, one loop, separator at 265 psia, tolerance asked 1e-12.

| Branch | Solve, lb/d | Stream, lb/d | Gap, lb/d |
| --- | --- | --- | --- |
| e1 AGBADA-2 flowline | 6004.874117054 | 6004.874117054 | 0.000000000 |
| e2 AGBADA-6 flowline | 2318.356346320 | 2318.356346320 | 0.000000000 |
| e3 AGBADA-9 flowline | 3992.446687538 | 3992.446687538 | 0.000000000 |
| e4 AGBADA-12 flowline | 640.000000000 | 985.000000000 | 345.000000000 |
| c1 North bypass | 9553.095088544 | 9898.095088544 | 345.000000000 |
| c2 Crosslink | 589.864625170 | 589.864625170 | 0.000000000 |
| c3 Loop leg | 3402.582062368 | 3402.582062368 | 0.000000000 |
| tk Trunk | 12955.677150912 | 13300.677150912 | 345.000000000 |

## Why it is the same 345 three times

AGBADA-12 is allocated 985 lb/d on a flowline that cannot pass more than 640 lb/d in either direction, a shortfall of 345.000000000 lb/d by construction. The solve pins that node and still reports its well rate as 985.000000000 lb/d while its flowline passes 640.000000000 lb/d. The propagation takes the reported rate at face value, so the shortfall enters at that well's own flowline and rides unchanged through the north bypass and the trunk, because nothing between them adds or removes mass. Five branches agree exactly. Three carry a hole nothing in the return names.

## What the engine says about that same answer

`converged` true, `ok` true, 11 iterations, `residualLbD` 1.546141e-11 lb/d, `pinned` t4. `checkConservation` on that answer reports produced 13300.677150912 lb/d, delivered 12955.677150912 lb/d, gap 345.000000000 lb/d, 2.593852900 percent of what the engine says was produced. The propagation itself returns `ok` true with no warnings.

## The mistake

Reconciling a facility measurement against `branchStreams` and reading a match as a check on the solve. The trunk stream says 13300.677150912 lb/d and the trunk the solve found says 12955.677150912 lb/d, and only one of those is an answer to a network problem. No referee stands behind this: `oracle_network.py` never propagates a stream at all, so the comparison has to be made against the engine's own `wellRates` or not at all.

## Exercise

Take the trunk stream mass and the trunk flow on this network and write their difference. Then name every branch that carries it, and say which field you would compare `wellStreams[id].massLbD` against to catch it at the door.
