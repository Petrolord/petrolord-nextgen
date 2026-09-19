# A cut the curve cannot answer

Module 1 built a blend's curve that stops short. This lesson draws Kwale's cuts on it and reads what the engine says about the cuts that fall off the end.

{{panel:crude-valuation-explorer}}

## The partial blend again

Kwale Light with the Ebocha partial assay, 50 and 50. The Ebocha curve says nothing below 110 F or above 920 F, so the blend's curve keeps only the temperatures where both crudes are known. It starts at 110 F and stops at 920 F.

Kwale's cut set was drawn for whole crudes. Its LPG cut runs from the start of the curve to 90 F, and its naphtha cut from 90 F to 330 F. Both need the curve at 90 F. The blend's curve has no value there.

## What the engine returns

The digest prints the yields on Kwale's cuts:

| cut | yield volume percent |
| --- | --- |
| LPG / Light ends | unknown |
| Naphtha | unknown |
| Kerosene / DPK | 16.9626 |
| Diesel / AGO | 19.2202 |
| Atmospheric residue | 40.1548 |

unknownCuts: LPG / Light ends, Naphtha. Closes: false.

Three things are worth reading in that result.

First, the two cuts whose bounds lie outside the curve come back unknown. There is no yield, and there is no zero. A zero would say the blend has no light ends and no naphtha, which is a claim about the crude that nobody measured. Unknown says the assay cannot tell.

Second, the engine names them. unknownCuts lists LPG / Light ends and Naphtha by name, so the reader knows which products the valuation is blind to without scanning the table for gaps.

Third, the set does not close. Closing needs every cut to have a yield and the total within the engine's closing tolerance of 100 percent. With two cuts unknown, the first condition fails, and the engine reports closes false.

## The cuts that are answered

Kerosene / DPK, from 330 F to 480 F, sits wholly inside the stretch the curve covers, and so does Diesel / AGO from 480 F to 650 F. Both get yields: 16.9626 and 19.2202. Atmospheric residue starts at 650 F, inside the curve, and runs to the end of the curve; the engine gives it 40.1548.

Those figures are real, and they are usable. A refinery that only wanted to know the middle distillate yield of this blend has its answer. What it does not have is a whole barrel accounted for.

## Why not normalise

A tempting repair is to scale the three known yields up until they total 100. That would spread the missing light ends and naphtha across kerosene, diesel and residue in proportion to their size, which is a guess about the crude dressed as a yield. The engine reports the total as it computes and never normalises, so that guess is never made on the reader's behalf.

## What a partial assay is good for

The Associate tier showed that a cut set drawn inside a partial curve has every yield. The fix for a blend like this one is on the assay side: supply the light end of the Ebocha curve, and the unknown cuts can be answered. Until then the engine's answer is the honest one: some cuts are known, two are not, and the set does not close.

## Exercise

Read the five yields, unknownCuts and closes. Say which bound of each unknown cut lies outside the blend's curve, why the engine returns unknown for it instead of a zero, and which of the two closing conditions this set fails.
