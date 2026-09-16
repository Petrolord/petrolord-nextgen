# A table is a table

A spacing requirement of 90.000000 m between a flare and a control room is a figure read out of a table. It did not come from a calculation, and it does not move when the flare duty moves.

{{panel:fc-layout-explorer}}

## The figures this station uses

| pair | required m |
| --- | --- |
| wellhead to wellhead | 3.000000 |
| wellhead to separator | 15.000000 |
| separator to tank | 15.000000 |
| tank to pump | 15.000000 |
| heaterTreater to tank | 30.000000 |
| flare to tank | 60.000000 |
| flare to control | 90.000000 |
| pump to pump | 3.000000 |
| valve to psv | 0.000000 |
| separator to valve | 0.000000 |
| tank to skid | null, the table has no figure |

The lookup is symmetric, so a separator against a tank and a tank against a separator both return 15.000000 m.

## What is held about these figures

These are the customary onshore production-facility values as this engine records them, with no source checked, and they are meant to be replaced by a site standard. That is HELD FOR LITERATURE. A course may teach what a table is and how a lookup behaves. It may not treat 90.000000 m as a calculated result or build a conclusion on the figure itself.

The practical reading is that the table is a placeholder with the right shape. When a site standard exists it replaces the table wholesale, and every spacing verdict on the layout moves with it.

## Zero is a requirement of nothing

Two of the rows read 0.000000 m. A valve beside a relief valve and a separator beside its own dump valve have no separation requirement in this table, and the engine counts those pairs separately rather than scoring them as checks that passed. On the ERHA station 21 pairs carry no requirement against 69 comparisons that do.

## Null is not zero

A tank against a skid returns null. The table has no entry for that pair, so the engine returns the absence rather than a guess. Modern equipment is full of these: a meter, a skid, a pig launcher or a booster package has no row, and on ERHA a single chemical injection skid produces 12 unknown type pairs on its own.

Those pairs make the layout incomplete, which is honest and inconvenient at the same time.

## The mistake

The mistake is reading null as zero and counting the pair as a pass. A pair with no requirement was never checked, and a layout that reports a clean sheet because most of its pairs had no table row has been judged on almost nothing.

## Exercise

Give the table requirement for a flare against a control room, a tank against a pump and a tank against a skid. Then explain the difference between a requirement of 0.000000 m and a requirement of null, and state what is held for the literature about every figure in the table.
