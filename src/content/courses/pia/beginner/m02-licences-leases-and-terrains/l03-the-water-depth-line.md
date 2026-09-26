# The water depth line and the terrain string

{{panel:pia-royalty-calculator}}

The Act draws the line between shallow water and deep offshore at a water depth of 200 metres. A learner might expect the engine to take the depth and pick the terrain. It does not. The terrain is a stated string, and the depth, if it is carried at all, is never read. This lesson explains why, and what the texts say about a field that sits across the line.

## The line in the text

The 200 metre line appears in the terrain rates of Seventh Schedule para 10(2): shallow water is "up to 200m water depth" and deep offshore is "greater than 200m water depth". The Nigeria Tax Act 2025 restates it, calling deep offshore "beyond 200m water depth".

## Why the engine takes a string

The engine carries `pia_water_depth_m` among the terms of a case and never reads it. The terrain string alone decides the royalty and the tax. There are two reasons this matters. First, the texts attach every rate to a named terrain, so a model should state the terrain plainly. Second, a field can lie across the line, and a single depth figure cannot describe such a field.

## A field in two terrains

The texts deal with a field that lies partly in two terrains. Seventh Schedule para 10(7):

> "(7) Where a field is located partially in onshore and in shallow water or partially in shallow water and deep offshore areas, the weighted average royalty shall be calculated as per regulations."

The Regulations then set the method, in r.14(5) for a field partly onshore and partly in shallow water:

> "(5) The weighted average royalty rate calculation for a field partially in onshore and partially in shallow water shall be as follows: (a) determine the royalty rate as if the entire field is onshore ;"

The method computes the royalty rate twice, once as if the whole field were in each terrain, and weights the two rates by each terrain's share of production. The engine does not model this. A field lying in two terrains is concept-only in this course: taught from its text with its citation, and never graded on a number.

| what a case states | what the engine reads |
| --- | --- |
| pia_terrain | the royalty tranches, the terrain rate and whether the hydrocarbon tax applies |
| pia_water_depth_m | nothing |
| a field in two terrains | nothing; concept-only |

## The shallow water ceiling

The terrain decides a rate only above the small-field tranches. Ekene Alpha is a shallow water lease whose daily rate falls from 8320.000000 bopd in 2026 to 3853.284153 bopd in 2032, below the 10,000 bopd edge in every year, and onshore and shallow water pay the same rates there. Moving Alpha onshore therefore changes no royalty at all.

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Run ekene_alpha_shallow_converted_nta and note the total royalties tile. In the case box change pia_water_depth_m to any depth you like beyond the 200 metre line and run it again; confirm that no figure moves. Restore the depth and change pia_terrain to "onshore"; confirm that the total royalties tile is unchanged and explain why from the tranches. Finally change the terrain to "frontier" and note which figures move, and which provision of the Seventh Schedule moved each one.
