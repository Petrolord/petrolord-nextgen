# Quality control

The Associate tier had a quality control lesson built around one chain and one total. A partition adds four checks of its own, and removes the usefulness of none of the old ones.

## The four partition checks

**Completeness.** Every oil bearing cell belongs to exactly one block. Verify by adding the block cell counts and comparing to the field count. At Ekene, 117 plus 52 equals 169.

**Volume closure.** The block volumes reproduce the field volume. At full precision this holds exactly for cells, gross rock volume and net volume, and to about fifteen significant figures for pore volume, hydrocarbon pore volume and STOIIP. Anything worse than that is a structural error rather than a rounding artefact.

**Invariance under relabelling.** Moving the fault must leave the field total untouched. This is the cheapest check in the set and it catches a whole class of bugs, because a total that moves when only labels moved means cells are being counted in more than one place.

**Label coverage.** Every node in the frame carries a label, including dead nodes. A partial label array leaves cells belonging to no block, which shows up as a shortfall in the volume closure check.

## What the checks cannot see

Two failures pass all four checks cleanly, and both are more likely than the failures the checks catch.

A cell in the wrong block passes everything. Completeness holds because the cell is in exactly one block. Closure holds because the sum is unchanged. Invariance holds. The only way to catch it is to look at the map and confirm the boundary is where you think it is, which is why the panel draws the fault trace through the boundary the labels actually use rather than at the number you typed.

A fault that does not seal passes everything too. The arithmetic of a partition is identical whether or not the partition is physically real. Nothing in a volumetric model can test the premise, and no amount of checking inside the model substitutes for the pressure and fluid evidence outside it.

## Carrying forward the Associate checks

The checks from the tier below all still apply and two of them now apply per block.

The chain should multiply out: each block's gross rock volume times 0.8 gives its net, times 0.20 gives its pore volume, times 0.65 gives its hydrocarbon pore volume. Do this per block, because an error in one block's chain is invisible in a field total that was accumulated separately.

Mean column against cell count should be consistent with the gross rock volume: cells times cell area times mean column. Again per block.

And the sanity check that matters most is unchanged. Compare the answer against the contact sensitivity, because if a modelling decision moves the answer by less than a metre of contact does, it is not the thing to spend the afternoon on.

## Reading it off the panel

The panel prints the two closure tiles side by side for exactly this purpose.

{{panel:rc-block-explorer}}

Run the invariance check yourself now. Step the fault through every position from 800 m to 2300 m with both contacts at 1560 m, and watch the field total tile. It should read 12.139208 at every single step while the block tiles move continuously.

Then break the check deliberately in your head: if the field total had risen as you moved the fault east, what would that mean? It would mean the boundary test is assigning some cells to both blocks, most likely because one comparison uses less than and another uses less than or equal.

## Worked example

Run the full check set on the capstone configuration and record each result.

Completeness: 117 plus 52 is 169, and the field reports 169. Pass.

Volume closure: 18.079852294921874 plus 4.189183349609375 is 22.26903564453125, and the field reports 22.26903564453125. Exact. In STOIIP, 9.85561714769438 plus 2.2835909598023787 is 12.139208107496758 against a field total of 12.139208107496763, a difference of 5.3 parts in $10^{15}$. Pass.

Invariance: the field total holds at 12.139208107496763 at every fault position. Pass.

Chain per block: $18.079852 \times 0.8 = 14.463882$, matching the west net volume; $\times 0.20 = 2.892776$, matching its pore volume; $\times 0.65 = 1.880305$, matching its hydrocarbon pore volume. Pass.

Four passes, and the model could still be wrong in both of the ways listed above, which is the note to end on.

## Exercise

A partitioned model passes completeness and closure but its map shows the fault trace two cells east of where the report says the fault is. State which check failed, what the likely cause is, and how much volume could be affected.

Self check: no arithmetic check failed, because a boundary in the wrong place is a self consistent partition of the wrong thing. The likely cause is an off by one or an origin mismatch between the fault easting and the grid indexing. Two columns of cells are affected, which at Ekene would be roughly 26 oil bearing cells and on the order of 1.8 MMstb moved between compartments.
