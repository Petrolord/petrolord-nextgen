# What BEP is

The best efficiency point is the maximum of one curve out of three, and it is not the curve most people picture.

{{panel:pd-stage-explorer}}

## The maximum of the efficiency fit

On the published golden vendor curve the best efficiency point is a rate of 2635.0000 bbl/d, an efficiency of 0.739054805 fraction and a head of 26.992525 ft, all three recorded in the golden.

The head there is not the highest the stage makes. Head at 1500 bbl/d is 31.985714 ft, and head falls monotonically across the published range, so the tallest head is always at the low end. The power there is not the lowest either: brake power per stage on a specific gravity of 1.00 climbs from 0.64381596 hp at 1500 bbl/d to 0.75437842 hp at 3500 bbl/d without turning over.

BEP is defined by the efficiency curve alone, and the head and power reported with it are readings at that rate rather than optima.

## It is not the vendor's best point

The vendor published 74.00 percent at 2500 bbl/d, the highest efficiency on the sheet. The engine returns 0.739054805 fraction at 2635.0000 bbl/d. Those are claims about different things: the first is a measured point, the second the peak of a cubic fitted to five of them, and that cubic reads 0.73657143 fraction at 2500 bbl/d, below its own peak.

Every reference stage shows the same separation. Their catalogue peak efficiencies are 0.63, 0.70, 0.72 and 0.74 fraction at generating rates of 1000, 2500, 4000 and 7000 bbl/d, and the BEP rates that come back are 1001.1250, 2498.7500, 4002.0000 and 7001.5000 bbl/d, with heads of 32.97028329, 28.00979755, 22.99263816 and 17.99768547 ft against generating heads of 33, 28, 23 and 18 ft.

## Why it is the number everybody quotes

Efficiency is the only one of the three readings with an interior maximum inside the published range. Head is monotone down and power monotone up, so neither offers a natural place to sit. The recommended operating band is built around the BEP rate for that reason, not because efficiency is all that matters.

## The mistake

Quoting the highest published efficiency point as the BEP. On this curve that names 2500 bbl/d where the engine names 2635.0000 bbl/d, and the difference is not rounding, it is a measured point against the top of a fitted curve.

The related error is quoting the head at BEP as the pump's head. That is 26.992525 ft here, one of the lower heads the stage makes anywhere in its range.

## What it refuses

`bepOf` with no efficiency fit returns a rate of NaN and a head of NaN. No efficiency points means no BEP, even though the head fit is intact and still reads 27.914286 ft at 2500 bbl/d. The BEP is a property of the efficiency data and of nothing else.

## Exercise

Read the BEP rate, head and efficiency on the vendor curve, then read head at 1500 bbl/d and brake power at 3500 bbl/d.

Say which of head, efficiency and brake power is at its best value at the BEP rate, and what the other two are doing there.
