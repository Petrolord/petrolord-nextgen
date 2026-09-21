# Overpressure against distance

{{panel:cq-harm}}

Module one built the chain from a fuel mass to a scaled distance to an overpressure. This module reads the result as a field: how the overpressure from one charge changes as you walk away from it, and how to run that question backwards. Start with the forward direction and one charge.

## One charge, five distances

BONGA's charge is 500 kg of TNT (stated). At five stated distances the engine returns:

| distance m, stated | Z m/kg^(1/3) | overpressure Pa |
| --- | --- | --- |
| 20 | 2.519842 | 121853.141070 |
| 50 | 6.299605 | 19626.657230 |
| 100 | 12.599210 | 7457.699887 |
| 200 | 25.198421 | 3427.919093 |
| 300 | 37.797631 | 2247.931733 |

Read the shape before the numbers. Between 20 m and 50 m the overpressure drops from 121853.141070 Pa to 19626.657230 Pa. Between 200 m and 300 m it drops only from 3427.919093 Pa to 2247.931733 Pa. Most of the fall happens close in. That is the Kinney and Graham curve seen through a fixed charge: steep in the near field and a long gentle tail beyond.

## Why the shape matters for a consequence note

A steep near field means a distance quoted to the nearest ten metres can carry a large overpressure error close to the charge and a small one far from it. A long tail means a modest overpressure reaches a long way. When you choose which distances to report, report them where the decisions sit. A near field figure shows where the blast is strongest; a tail figure shows how far a modest overpressure is felt.

## The same Z from a very different charge

Cube root scaling says any charge and distance with the same Z gives the same overpressure. The published conference column that stands behind this course's grading includes a charge of 0.5 kg at 5 m, for which the engine gives 19.626657 kPa. BONGA's 500 kg at 50 m gives 19626.657230 Pa. They are the same figure, one in kPa and one in Pa, because the two pairs share one scaled distance, 6.299605 m/kg^(1/3). A published small charge test is therefore evidence about a large accidental charge.

## What the curve leaves you to decide

The engine gives the free air peak side-on overpressure at each distance and nothing else. It does not know whether the charge sits on the ground or how congested the cloud was. Both enter only through the analyst's choice of TNT mass, which is why the charge is stated and written into the note, together with the yield factor behind it where a fuel mass came first. A later lesson in this module sets out what a free air burst leaves out.

## Exercise

On the harm panel's blast view, enter 500 kg of TNT and reproduce all five rows of the table above. Then enter 0.5 kg at 5 m and confirm the engine returns the same overpressure as the 50 m row. Write two sentences for a consequence note describing BONGA's blast field: one naming the distance band where the overpressure falls fastest, and one naming the stated charge and the model that produced every figure.
