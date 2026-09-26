# Weighted rates at the tranche edges

{{panel:pia-royalty-calculator}}

{{panel:pia-hct-calculator}}

A tranche scale is only as clear as its edges. Every edge raises the same two questions: which side does a field sitting exactly on the edge belong to, and what happens one barrel past it? This lesson answers both for each edge, one rule at a time, because an edge rule stated once for all edges would be wrong for some of them.

## The edges, rule by rule

| rule | at the edge | just past it |
| --- | --- | --- |
| onshore first tranche, 5,000 bopd | 0.050000 | 0.050005 |
| onshore second tranche, 10,000 bopd | 0.062500 | 0.062509 |
| shallow water second tranche, 10,000 bopd | 0.062500 | 0.062506 |
| deep offshore tier, 50,000 bopd | 0.050000 | 0.050000 |

Read each row on its own.

The first tranche includes its edge. At 5,000 bopd onshore and shallow water pay exactly 5 percent; at 5,001 the one barrel past the edge pays 7.5 percent and the weighted rate moves to 0.050005.

At 10,000 bopd both terrains pay exactly 6.250000 percent, the average of the two small-field tranches. Just past it the terrain rate enters for the barrels over 10,000, and the terrains part: onshore at 0.062509 and shallow water at 0.062506, because 15 percent pulls harder than 12.5.

The deep offshore edge also belongs to the tier below it. One barrel past 50,000 bopd moves the weighted rate by less than the course's six decimals, so it prints 0.050000.

## A gap in the Regulations that moves nothing

The Regulations write the onshore and shallow water scale as three formulas. Rule 13(2)(b) opens "(b) for production greater than 5,000bopd but less than 10,000bopd," and rule 13(2)(c) opens "(c) for onshore areas where production is greater than 10,000bopd, the". Neither formula names exactly 10,000 bopd.

The gap is real in the text and empty in the arithmetic. At exactly 10,000 bopd both formulas give 0.062500 from the stated tranches, and that is what the engine returns. No field's figure depends on which formula you read at that point. A misprint or a gap in a text is quoted as printed and said to be one; this one is harmless.

## Why the edges matter for the tax

The hydrocarbon tax base deducts the production royalty on crude oil and condensate, so a field near an edge sees its tax base move as its daily rate crosses. Near 5,000 and 10,000 bopd the weighted rate changes slowly at first, because only the barrels past the edge pay the higher tranche. A field declining through 5,000 bopd, as Ekene Alpha does between 2029 and 2030, steps down to exactly 5 percent and stays there.

## Exercise

Both practicals run in the course's own calculator panels, which call the same engine.

1. In the royalty calculator, open "Royalty by terrain and daily rate". Type 5000, 5001, 9999, 10000 and 10001 for onshore, then for shallow_water, and match every return to the table above. Where do the two terrains first differ?
2. Type 50000 and 50001 for deep_offshore. Explain why the second prints the same six decimals.
3. In the hydrocarbon tax calculator, open "The tax base and the cost price ratio on a ledger" and start from worked_example_inputs_default: shallow water, 2025, 18250000 bbl of oil, which is 50,000 bopd. Note the HCT assessable profit in 2025.
4. Divide `oil_bbl` by ten, so the field sits exactly on the 5,000 bopd edge, and read the ledger again. Besides the royalty rate, what else moved in the tax base, and which column shows the cost price ratio starting to bind?
