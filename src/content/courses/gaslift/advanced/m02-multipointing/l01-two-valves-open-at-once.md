# Two valves open at once

Multipointing is one comparison repeated: has the casing fallen further, since this valve opened, than the valve's spread.

{{panel:pd-unloading-explorer}}

## The rule in one line

A valve opens at its own stage. Every later transfer drops the casing. The valve shuts when the accumulated drop measured at valve depth passes its spread, and until it does the valve is still passing gas while a deeper one has taken over. The string then injects at two depths.

## The knife edge, valve by valve

midDecrementKnifeEdge is spaced on 26.75 psi per valve.

| Valve | Spread, psi | Drop one stage after it opens, psi | Drop the stage after that, psi |
| --- | --- | --- | --- |
| 1 | 55.525309973 | 28.652797457 | 57.297259447 |
| 2 | 46.733519484 | 30.078345259 | 60.142695332 |
| 3 | 39.016557082 | 31.219546623 | 62.420696865 |
| 4 | 32.272254090 | 32.122462454 | 64.222946638 |
| 5 | 26.401432257 | 32.824113062 | |
| 6 | 21.310451869 | 33.355029522 | |

Valves 1 to 4 survive exactly one transfer each, so the string multipoints at stages 2, 3, 4 and 5. Valves 5 and 6 have spreads narrower than a single stage of drop and shut immediately, so stages 6 and 7 are clean. Stage 1 is clean because nothing sits above valve 1.

## The drop at depth is not the decrement

At surface each transfer removes exactly 26.75 psi. At valve 1 depth the same transfer removes 28.652797457 psi, and at valve 6 depth 33.355029522 psi. The comparison happens at valve depth, on a gas column whose weight moves with the pressure it is carrying, so the drop a valve actually feels is larger than the number the designer typed and grows with depth.

## The mistake

Assuming multipointing is a problem of the top of the string. The spreads shrink with depth on this design, from 55.525309973 psi on valve 1 to 21.310451869 psi on valve 6, while the drop per stage grows. Both effects push the deeper valves toward shutting cleanly, and the four stages that multipoint are the shallow four. On a design with a smaller decrement the same shrinking spread will keep valves open further down, and the pattern reverses.

## What it refuses

The verdict says two valves are open. It does not say how the gas divides between them, because there is no split anywhere in the module: each stage reports a single gas rate through the valve that took the transfer, 1534.198233515 Mscf/d at stage 2 with valve 1 still open. It also does not say the well fails to unload. Multipointing is a warning about where the gas goes, and the engine has no model of what that costs.

## Exercise

For each of the six charged valves in the panel, read its spread and the casing drop at the stage after it opens, and mark the valves where the drop is smaller.

Then say why valve 4 belongs in that group and valve 5 does not, using both numbers rather than the multipointing flag.
