# A cut the curve cannot answer

Module 1 built a blend's curve that stops short. This lesson draws Kwale's cuts on it and reads what the engine says about the cuts it cannot reach.

{{panel:crude-valuation-explorer}}

## The partial blend again

Kwale Light with the Ebocha partial assay, 50 and 50. The Ebocha curve says nothing below 110 F or above 920 F, so the blend's curve keeps only the temperatures where both crudes are known. It starts at 110 F and stops at 920 F.

Kwale's cut set was drawn for whole crudes. Its LPG cut has no lower bound and runs to 90 F, and its naphtha cut runs from 90 F to 330 F. Both need the curve at 90 F, and the blend's curve has no value there. The engine's rule is that a cut with a bound below 110 F or above 920 F has no yield. Kwale's set has no bound above 920 F, so the two cuts without a yield are the two bounded at 90 F.

## What the engine returns

The yields on Kwale's cuts:

| cut | yield volume percent |
| --- | --- |
| LPG / Light ends | unknown |
| Naphtha | unknown |
| Kerosene / DPK | 16.9626 |
| Diesel / AGO | 19.2202 |
| Atmospheric residue | 40.1548 |

unknownCuts: LPG / Light ends, Naphtha. Closes: false. The cuts with a yield total 76.3376 percent.

Three things are worth reading in that result.

First, the two cuts with a bound below 110 F come back unknown. There is no yield, and the engine does not put a zero in its place. The table prints unknown, which says the blend's curve has no value at the bound.

Second, the engine names them in unknownCuts, so the reader knows which products are missing without scanning the table for gaps.

Third, the set does not close. Closing needs every cut to have a yield and the total within the engine's closing tolerance of 100 percent. With two cuts unknown, the first condition fails, and the engine reports closes false.

## The cuts that are answered

Kerosene / DPK, from 330 F to 480 F, sits wholly inside the stretch the curve covers, and so does Diesel / AGO from 480 F to 650 F. Both get yields: 16.9626 and 19.2202. Atmospheric residue has no upper bound. It runs from its lower bound to 100 percent, and its lower bound of 650 F lies inside the curve, so the engine gives it 40.1548.

Those yields are usable for the middle of the barrel. The whole barrel is not accounted for.

## The total as it computes

The engine does not scale the three known yields up until they total 100. The Associate tier's rule holds on a blend as on a single crude: the total is reported as it computes, and here that is 76.3376 percent, with the two cuts it leaves out named in unknownCuts.

## The same gap in the valuation

Valued on Kwale's prices, costs and losses, netbackValue carries the gap forward. It names the cuts with no yield (unyieldedCuts: LPG / Light ends, Naphtha), keeps their yield and value empty, and reports the valuation complete: false. Its netback over the cuts it can value is 48.3393 $/bbl.

Both reports name the same two cuts. It starts in the Ebocha curve, which says nothing below 110 F, and the engine reports it in the yields and again in the valuation.

## Exercise

Read the five yields, unknownCuts and closes. Say which bound of each unknown cut lies outside the blend's curve, why the engine returns unknown for it instead of a zero, and which of the two closing conditions this set fails. Then say what complete: false tells a reader of the 48.3393 $/bbl netback.
