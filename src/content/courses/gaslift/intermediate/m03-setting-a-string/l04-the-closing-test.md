# The closing test

The closing test can be run at valve depth or at surface, and on an injection operated string the two roads meet. On a production operated string one of them is asking about the wrong fluid.

{{panel:pd-valve-explorer}}

## Two roads, one verdict

The published rule tests the acting pressure at valve depth against the dome at valve temperature. The engine tests the stage's casing pressure at surface against a closing surface pressure obtained by inverting that dome up a gas column. On westTexasOil stage 3 the depth road gives valve 1 an acting pressure of 1015.405612280 psia against a dome of 1021.076842603 psia, a margin of -5.671230322 psi and a shut verdict. The surface road gives 964.7000 psia against 970.055864496 psia, a margin of -5.355864496 psi and the same verdict. The same stage keeps valve 2 open on both roads, at 10.525246278 psi of depth margin and 9.554898266 psi of surface margin. Verdict agreement across all 8 stages of that design is true.

## The same line, the wrong fluid

For a production operated valve the dome balances against the tubing, but the closing surface pressure is still obtained by inverting it up a casing column, and the unloading sequence still compares it with the casing.

| constantPressurePPO valve | Casing side clears by, psi | Tubing side misses by, psi |
| --- | --- | --- |
| 1 | 724.986977462 | 52.249540846 |
| 5 | 386.720447199 | 31.822047314 |

Across the six valves the casing side clears by 379.101060 to 724.986977 psi and the engine calls every one of them open. The tubing side rule they should be judged by misses by 31.822047 to 52.249541 psi, and the oracle calls every one of them shut. The engine reports multipointing at stages 2, 3, 4, 5 and 6. The oracle reports every stage clean. They disagree on all five later stages and the verdict agreement for the case is false.

## One defect, two symptoms

The swapped acting fluid that produces those negative spreads on this string is the same choice that sends the closing test to the casing. Fix one and the other goes with it. The closing verdict is what got reported, because a multipointing warning on every stage is loud in a design review. The negative spread sat in the valve table the whole time, simpler to see and needing no stages at all, and nobody raised it.

## What it refuses

This is a pinned known divergence rather than a repaired defect, because the engine is consumed by a live application. On a PPO string the closing column, the open flag and the multipointing warnings are all downstream of it, and none of them should be designed on.

## Exercise

Read the depth margin and the surface margin for westTexasOil valve 1 at stage 3 and confirm both give the same verdict.

Then read the same two quantities for constantPressurePPO valve 1 and state which fluid each is measuring.
