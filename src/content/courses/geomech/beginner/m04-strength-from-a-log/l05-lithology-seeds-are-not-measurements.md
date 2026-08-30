# Lithology seeds are not measurements

Five rows of default numbers, and what they are for.

{{panel:gm-stress-explorer}}

## The table the engine carries

| lithology | Poisson ratio | friction angle | cohesion | Young's modulus |
|---|---|---|---|---|
| sandstone | 0.20 | 35 deg | 5 MPa | 30 GPa |
| shale | 0.35 | 20 deg | 10 MPa | 15 GPa |
| limestone | 0.30 | 40 deg | 20 MPa | 50 GPa |
| dolomite | 0.28 | 45 deg | 25 MPa | 60 GPa |
| salt | 0.25 | 0 deg | 1 MPa | 25 GPa |

## What they are

Starting values. A place to begin a screening run on a well with no core and no shear sonic.

## What they are not

Measurements of anything. There is no such thing as "the" Poisson ratio of sandstone: it varies with cementation, porosity, clay content and stress, across a range far wider than the difference between two rows of this table.

## Reading the table for what it does teach

**Shale has the highest Poisson ratio and the lowest friction angle.** Both push toward a narrower mud window: a high Poisson ratio gives a high k0 and therefore high horizontal stresses, and a low friction angle gives little confinement benefit. Shale is the difficult rock, and this table says so.

**Salt has a friction angle of zero.** That is not an approximation, it is the defining property: salt creeps and cannot sustain a stress difference. Every column of a salt row should be read as "this material needs a different model".

**Limestone and dolomite are stiff and strong.** High modulus, high friction angle. They tolerate a wide window and they are usually not the section that decides the casing programme.

## Where they are dangerous

When a seed value survives into a final answer without anybody noticing it was a default.

A report that quotes a collapse gradient to three decimals, computed from a Poisson ratio of 0.35 that came from a table because the well had no shear log, is quoting a precision it does not have.

## What to do about it

Two things.

**Record provenance for every parameter.** Measured, calibrated, or seeded. The engine does this for the UCS correlations by returning their citation strings, and the same discipline belongs on the elastic parameters.

**Run the sensitivity.** If moving the Poisson ratio across a plausible range moves the answer more than the decision can tolerate, then the answer is not yet an answer, and the next thing to buy is a shear log or a core.

## The honest summary of this module

Strength comes from a correlation, elastic properties come from a table, and both are screening tools that a real study replaces with measurements as they become available. The engine's job is to be explicit about which is which.

## Exercise

Take the shale row and the sandstone row. Compute k0 for each, and q for each.

Then say, without running the stability calculation, which of the two you would expect to have the narrower mud window at the same depth, and give both reasons.
