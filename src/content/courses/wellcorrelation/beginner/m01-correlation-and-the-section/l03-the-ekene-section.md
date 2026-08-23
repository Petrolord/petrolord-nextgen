# The Ekene section

Every course on this path works a single fixture from beginning to end, so that by the time you reach the capstone the data is familiar and only the technique is being tested. For Well Correlation that fixture is the Ekene section: four wells, four named tops, one reservoir sand, and a structural story that the section will tell you if you read it properly.

## The four wells

The section runs left to right through Ekene-1, Ekene-2, Ekene-3 and Ekene-4. Each well has formation tops picked in measured depth, in metres. Four surfaces are named across the section: TOP_A, TOP_SAND, BASE_SAND and TOP_B, listed here from shallowest to deepest.

| Top | Ekene-1 | Ekene-2 | Ekene-3 | Ekene-4 |
| --- | --- | --- | --- | --- |
| TOP_A | 1500 | 1512 | 1495 | 1530 |
| TOP_SAND | 1548 | 1565 | 1541 | 1590 |
| BASE_SAND | 1580 | 1601 | 1570 | 1615 |
| TOP_B | 1640 | 1662 | 1628 | absent |

Ekene-4 has no TOP_B. This is not a missing pick or an oversight in the dataset. The well reached total depth above that surface, so TOP_B is genuinely not present in Ekene-4 and no honest interpretation can supply it. A well that stopped short is a different situation from a well where a surface was eroded away or faulted out, and telling those cases apart is the subject of module 2. For now, note the consequence for the display: the TOP_B correlation line runs across three wells and simply stops. It does not reach the fourth.

Across the whole section the displayed depths run from 1495 m, the TOP_A pick in Ekene-3, down to 1662 m, the TOP_B pick in Ekene-2. That is a span of 167 m, which is the vertical window a structural view of this section has to cover.

## The reservoir interval

The interval between TOP_SAND and BASE_SAND is the SAND, and it is the reservoir of interest for this course. Its gross thickness in each well is the simple difference between those two picks:

| Well | TOP_SAND | BASE_SAND | SAND gross thickness |
| --- | --- | --- | --- |
| Ekene-1 | 1548 | 1580 | 32 m |
| Ekene-2 | 1565 | 1601 | 36 m |
| Ekene-3 | 1541 | 1570 | 29 m |
| Ekene-4 | 1590 | 1615 | 25 m |

Thickest in Ekene-2 at 36 m, thinnest in Ekene-4 at 25 m, a range of 11 m across four wells. Notice that this is a fact about the rock and not about the display. Gross thickness is a difference between two depths in the same well, so it is completely unaffected by how the section is hung. That property becomes important in module 4, and it is one of the few numbers you can quote without first saying which view you were looking at.

The interval above the reservoir behaves rather differently. From TOP_A down to TOP_SAND the section measures 48 m in Ekene-1, 53 m in Ekene-2, 46 m in Ekene-3 and 60 m in Ekene-4. That is a wider spread than the sand shows, and the thickest overburden interval sits in the same well as the thinnest reservoir.

## The structural picture

Each named surface sits at a different depth in each well, and the size of that variation is the structural relief on the surface: the deepest pick minus the shallowest pick across the wells that have it.

| Top | Shallowest | Deepest | Relief |
| --- | --- | --- | --- |
| TOP_A | 1495 (Ekene-3) | 1530 (Ekene-4) | 35 m |
| TOP_SAND | 1541 (Ekene-3) | 1590 (Ekene-4) | 49 m |
| BASE_SAND | 1570 (Ekene-3) | 1615 (Ekene-4) | 45 m |
| TOP_B | 1628 (Ekene-3) | 1662 (Ekene-2) | 34 m |

Three of the four relief figures share the same pair of wells: Ekene-3 is the shallowest well on TOP_A, TOP_SAND and BASE_SAND, and Ekene-4 is the deepest on all three. TOP_B is the exception only because Ekene-4 does not reach it, so the relief there is measured over three wells and Ekene-2 takes the deep end. Relief on a surface picked in fewer wells is not comparable with relief measured across all four, and quoting the 34 m figure without that caveat would be misleading.

## The story the section tells

Read the two tables together and a single narrative emerges. Ekene-3 is the shallowest well on every surface it shares with the others, and Ekene-4 is the deepest. Ekene-4 also carries the thinnest reservoir, 25 m against 36 m in Ekene-2, and the thickest TOP_A to TOP_SAND interval at 60 m.

So the deepest well structurally is also the well where the sand is thinnest. Whether that is a depositional pattern, with the sand thinning toward the deeper part of the basin while the overlying section fills in above it, or something else entirely, is a geological argument rather than a fact the section can settle. What the section can do is present the pattern clearly enough that the argument is worth having, and that presentation is exactly what the flattened view in module 4 is for. On the structural panel the 11 m thickness range is hard to see, because a 49 m spread in the depth of TOP_SAND dominates the picture. Pin TOP_SAND flat and the thickness behaviour is the only thing left to look at.

Try it yourself: the panel below draws the Ekene section from the same engine, with the datum under your control.

{{panel:wc-section-explorer}}

## Exercise

Without looking back at the tables, write down the four top names in order from shallowest to deepest, then reconstruct the SAND gross thickness for all four wells from the pick depths. Next, work out the BASE_SAND to TOP_B interval in the three wells that have both surfaces and say why the fourth well has no answer. As a self-check, the SAND thicknesses are 32, 36, 29 and 25 m for Ekene-1 to Ekene-4; the BASE_SAND to TOP_B intervals are 60 m in Ekene-1, 61 m in Ekene-2 and 58 m in Ekene-3; and Ekene-4 has no answer because it reached total depth above TOP_B, so the lower surface was never drilled.
