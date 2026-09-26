# Fields that straddle terrains

{{panel:pia-hct-calculator}}

Reservoirs do not stop at the 200 metre line, and the Act and the Regulations have a rule for a field lying in two terrains. The engine does not compute it, so this lesson is concept-only: taught from the text with its citation and never graded on a number.

## What the texts say

The Petroleum Industry Act 2021, Seventh Schedule para 10(7): "(7) Where a field is located partially in onshore and in shallow water or partially in shallow water and deep offshore areas, the weighted average royalty shall be calculated as per regulations."

The Petroleum Royalty Regulations 2022 give the method. Rule 14(5) begins: "(5) The weighted average royalty rate calculation for a field partially in onshore and partially in shallow water shall be as follows: (a) determine the royalty rate as if the entire field is onshore ;". Rule 14(6) does the same for shallow water and deep offshore: "(a) determine the royalty rate as if the entire field is in shallow water ;". In the course's paraphrase, each rule computes the rate as if the whole field sat in each terrain, then weights the two rates by each terrain's share of production.

## What the engine does instead

The engine takes the terrain as one stated string: "onshore", "shallow_water", "deep_offshore" or "frontier". It carries a water depth in the terms, `pia_water_depth_m`, and never reads it. A field partly in two terrains has to be run under one terrain at a time, and the weighting by share of production is outside the engine.

| stated terrain | liquids bopd (stated) | royalty rate |
| --- | --- | --- |
| onshore | 20000 | 0.106250 |
| shallow_water | 20000 | 0.093750 |
| shallow_water | 60000 | 0.114583 |
| deep_offshore | 60000 | 0.054167 |

Each row is one limb of the Regulations' method: the rate as if the entire field sat in that terrain. At or below 10,000 bopd the onshore and shallow water limbs are equal, so a straddling field that small pays the same rate whatever the split.

## Why it stays out of the graded work

A graded figure in this course is a return value of the engine on stated terms and rows. The share of production in each terrain is an input the engine has no field for, so any weighted rate a learner builds is their own arithmetic. That is why the provision is concept-only.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "The tax base and the cost price ratio on a ledger" and start from ekene_alpha_shallow_converted_nta. Change `pia_water_depth_m` to 250 and confirm that no figure on the ledger moves. Say which input decides the royalty.
2. Double the 2026 `oil_bbl` so the year sits above 10,000 bopd. Run the case once with `pia_terrain` "onshore" and once with "shallow_water", and read the 2026 liquids royalty rate each time in the first table. These are the two limbs of r.14(5).
3. Write down the one input you would need, and cannot give the engine, to finish the Regulations' method.
